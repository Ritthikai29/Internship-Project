<?php
class Database
{
  private PDO $db; 
  private PDOStatement $stmt;
  private $driver;
  // private const config = [
  //   'dsn' => "sqlsrv:server=stsiotvmdbdev01, 3511;Database=test_merge_database",
  //   'db_user' => "follow",
  //   'db_pass' => "Follow@2022"
  // ];

  // private const config = [
  //   'dsn' => "mysql:host=localhost;dbname=scg_bidding;charset=utf8",
  //   'db_user' => "root",
  //   'db_pass' => ""
  // ];

  // public = 52.139.193.40,
  // private = 10.51.248.165

  // tanachod = 34.87.65.242,1433
  // natthapong(last) = 34.87.187.17,1433

  private const config = [
    'dsn' => "sqlsrv:server=52.139.193.40,3511;Database=STSBidding",
    'db_user' => "follow",
    'db_pass' => "Follow@2022"
  ];

  // Direct access to use every function....
  public function DB(){
    return $this -> db;
  }
  public function __construct()
  {
    try {
      $this->db = new PDO(self::config['dsn'], self::config['db_user'], self::config['db_pass']);
      $this->driver = $this->db->getAttribute(PDO::ATTR_DRIVER_NAME);
      // set PDO Error mode to exception
      $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
      $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // $this->db->exec("set names utf8");
      // $this->db->exec("SET NOCOUNT ON");
      // echo "Connection Successfully";
    } catch (PDOException | Exception $e) {
      self::generateLogFile($e->getMessage());
    }
  }

  public function setSqltxt($sqltxt)
  {
    $this->stmt = $this->db->prepare($sqltxt);
  }

  public function bindParams($key, $value, $type=PDO::PARAM_STR)
  {
    $this->stmt->bindValue($key, $value, $type);
  }

  public function execute()
  {
    return $this->stmt->execute();
  }

  public function query()
  {
    $this->stmt->execute();
    return $this->stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function queryAll()
  {
    $this->stmt->execute();
    return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function startTransaction()
  {
    switch ($this->driver) {
      case "mysql":
        $this->db->beginTransaction();
        break;
      case "sqlsrv":
        $this->db->beginTransaction();
        // case "sqlsrv": sqlsrv_begin_transaction($this->db);
        // break;
    }
  }

  public function commitTransaction()
  {
    $this->db->commit();
  }

  public function rollbackTransaction()
  {
    $this->db->rollBack();

  }

  public function generateLog($programPath, $errorLog)
  {
    $parentDirectoryPath = dirname($programPath);
    $parentFolderName = basename($parentDirectoryPath);
    $errorProgram = $parentFolderName . "/" . basename($programPath);
    try {
      $sql = "INSERT INTO [STSBIDDING_GENERATE_LOG](errorFunc, errorMsg, errorDate) VALUES(:errorProgram, :errorLog, :errorDate)";
      $stmt = $this->db->prepare($sql);
      $stmt->bindValue(":errorProgram", $errorProgram);
      $stmt->bindValue(":errorLog", $errorLog);
      $stmt->bindValue(":errorDate", date("Y-m-d H:i:s"));
      $stmt->execute();
    } catch (PDOException | Exception $e) {
      self::generateLogFile($e->getMessage());
    }
  }

  public function generateLogFile($errorMsg)
  {
    error_log($errorMsg, 3, 'error.log');
  }

  public function getQueryString(){
    return $this->stmt->queryString;
  }
}
