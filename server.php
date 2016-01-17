<?php
$connection = mysqli_connect(
/* servername */ "localhost",
/* username */ "root",
/*pass*/ "",
/*DB name*/ "fb");


$ajax = json_decode(file_get_contents("php://input"));

if($ajax->cmd == "load"){
    $new_cmnt_list[] = array();
    $i=0;

    $variable = $connection->query("SELECT *  FROM cmnt_list");
    foreach ($variable as $key => $value) {

        $new_cmnt_list[$i] = new stdClass();
        $new_cmnt_list[$i]->id = $value['id'];
        $new_cmnt_list[$i]->name = $value['name'];
        $new_cmnt_list[$i]->msg = $value['msg'];
        $i++;
    }
    echo json_encode($new_cmnt_list);
}
if($ajax->cmd == "insertData")
{
    $ans = " INSERT INTO cmnt_list (name,msg)  VALUES ( '{$ajax->data->name}', '{$ajax->data->msg}' )";
    $connection->query($ans);

    //echo json_encode($ans);
    //echo "ok";


}



?>
