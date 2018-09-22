#!/usr/bin/env python3.7
# -*- coding: utf-8 -*-

import asyncio
import aiohttp
import datetime
import errno
import functools
import gzip
import json
import logging
import os
# import signal
import time

from pymongo import MongoClient


# # Setup logging
# logger = logging.getLogger('tcpdump')
# logger.setLevel(logging.DEBUG)
# log_handler_file = logging.FileHandler(filename='tcpdump_fail2ban.log', encoding='utf-8', mode='a')
# log_handler_file.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
# logger.addHandler(log_handler_file)
# log_handler_console = logging.StreamHandler()
# logger.addHandler(log_handler_console)

# Globals
DEBUG = True
MONGO_CLIENT = MongoClient()
MONGO_DB = MONGO_CLIENT.SCPSL
MONGO_COLLECTION_SERVERS = MONGO_DB.servers
MONGO_COLLECTION_DATA = MONGO_DB.data
SERVER_MAP = {}

# # Nice exit from loop
# def ask_exit(signame):
#   global TCPDUMP_PROCESS

#   print('got signal %s: exit' % signame)

#   if TCPDUMP_PROCESS:
#     TCPDUMP_PROCESS.terminate()

#   loop.stop()

# Asyncio stuff
loop = asyncio.get_event_loop()
# for signame in ('SIGINT', 'SIGTERM'):
#   loop.add_signal_handler(getattr(signal, signame), functools.partial(ask_exit, signame))

# fetcher task
async def fetch_data_task():
  while True:
    await clean_server_map()
    timestamp = datetime.datetime.now()
    data = await fetch_data()
    if data:
      await process_data(timestamp, data)
    await check_server_map(timestamp)
    await asyncio.sleep(5)

async def clean_server_map():
  global SERVER_MAP

  print(' > Cleaning server map')

  for server in SERVER_MAP:
    SERVER_MAP[server] = -1

async def fetch_data():
  print(' > Fetching data')

  try:
    timeout = aiohttp.ClientTimeout(total=3)
    async with aiohttp.ClientSession(timeout=timeout) as session:
      async with session.get('https://wew.scpslgame.com/lobbylist.php') as response:
        return await response.text()
  except Exception as e:
    print(' ! Error in aiohttp')
    print(str(e))

async def process_data(timestamp, data):
  global SERVER_MAP
  global MONGO_COLLECTION_SERVERS
  servers = MONGO_COLLECTION_SERVERS

  print(' > Processing data')

  lines = data.split('<br>')
  for line in lines:
    if not line:
      continue

    pieces = line.split(';')
    ip = pieces[0]
    port = pieces[1]
    server_id = {
      'ip': ip,
      'port': port,
    }

    try:
      servers.insert_one({
        '_id': server_id,
        'info': pieces[2],
        'distance': pieces[4],
        'created_at': timestamp,
      })
    except:
      pass

    players_field = pieces[3]
    players = int(players_field.split('/')[0])
    if not players:
      players = 0

    await update_server(timestamp, ip, port, players)
    SERVER_MAP['{0}:{1}'.format(ip, port)] = players

async def update_server(timestamp, ip, port, players):
  global MONGO_COLLECTION_DATA

  server_id = {
    'ip': ip,
    'port': port,
  }

  try:
    MONGO_COLLECTION_DATA.insert_one({
      'id': server_id,
      'created_at': timestamp,
      'players': players
    })
  except:
    pass

async def check_server_map(timestamp):
  global SERVER_MAP
  global MONGO_COLLECTION_SERVERS
  servers = MONGO_COLLECTION_SERVERS

  print(' > Checking server map')

  for server in SERVER_MAP:
    if SERVER_MAP[server] == -1:
      pieces = server.split(':')
      ip = pieces[0]
      port = pieces[1]
      players = SERVER_MAP[server] # -1
      await update_server(timestamp, ip, port, players)

# Adding all tasks
loop.create_task(fetch_data_task())

# Run!
loop.run_forever()
loop.close()
