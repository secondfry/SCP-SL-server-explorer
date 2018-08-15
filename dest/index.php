<?php

class MDB {
  const DB = 'SCPSL';

  static public
  function get() {
    $mongo = new MongoDB\Client();
    return $mongo -> selectDatabase(self::DB);
  }
}

class Server {
  private $ip;
  private $port;

  public
  function __construct(string $ip, string $port) {
    $this -> ip = $ip;
    $this -> port = $port;
  }

  public static
  function getCollection(): \MongoDB\Collection {
    return MDB::get()
      -> selectCollection('servers');
  }

  public static
  function getAll() {
    return Server::getCollection()
      -> find([], [
        'projection' => [
          '_id' => 1,
          'name' => 1,
        ]
      ])
      -> toArray();
  }

  public
  function getPlayerInfo() {
    // This is timestamp, what could go wrong...
    $timestamp = new DateTime('now');

    // FIXME after more than 10 years, I still have no clue how PHP timezones work
    $timestamp -> add(new DateInterval('PT3H'));

    // Showing only last 15 minutes of data
    $timestamp -> sub(new DateInterval('PT1H'));

    // FIXME if I previously wouldn't add 3 hours, this timestamp would be jinxed
    $mdb_timestamp = new MongoDB\BSON\UTCDateTime($timestamp);

    $ret = [];
    $data = Server::getCollection()
      -> aggregate([
        ['$unwind' => '$players'],
        ['$project' => [
          'players' => 1,
        ]],
        ['$match' => [
          '_id' => [
            'ip' => $this -> ip,
            'port' => $this -> port,
          ],
          'players.created_at' => ['$gt' => $mdb_timestamp],
        ]],
        ['$replaceRoot' => [
          'newRoot' => '$players',
        ]],
      ]);

    foreach ($data as $line) {
      // Timestamps, man, they haunt me
      $timestamp = $line['created_at'] -> toDateTime();
      $timestring = $timestamp -> format('Y-m-d\TH:i:s');

      $ret[] = [$timestring, $line['amount']];
    }

    return $ret;
  }
}

require_once 'vendor/autoload.php';

use Slim\Http\Request as Request;
use Slim\Http\Response as Response;

$c = new \Slim\Container();

$c['notFoundHandler'] = function ($c) {
  return function ($request, $response) use ($c) {
    return $c['response']
      -> write(file_get_contents('index-view.html'));
  };
};

$app = new \Slim\App($c);

/** /api/server/list/ */
$app -> get(
  '/api/server/list/',
  function (Request $request, Response $response, array $args) {
    return $response -> withJson(Server::getAll());
  }
);

/** /api/server/:ip/:port */
$app -> get(
  '/api/server/{ip:[0-9\.]{7,15}}/{port:[0-9]{1,5}}/',
  function (Request $request, Response $response, array $args) {
    $server = new Server($args['ip'], $args['port']);

    return $response -> withJson($server -> getPlayerInfo());
  }
);

/** /api/ */
$app -> get(
  '/api/debug/',
  function (Request $request, Response $response, array $args) {
    $server = new Server('94.156.189.89', '7777');

    return $response -> withJson($server -> getPlayerInfo());
  }
);

$app -> run();
