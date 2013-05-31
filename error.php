<?php
echo "Ошибка # ".$_GET['error_num']." в работе теста, обратитесь к администратору тестирования.<hr> ";
echo "<br>Исправили ошибку? <a href='index.php'>Пробовать вновь</a><hr>";
//echo readfile("errors.txt");
$handle = fopen("errors.txt", "r");
while (!feof($handle)) {
    $buffer = fgets($handle, 4096);
    echo $buffer."<br>";
}
fclose($handle);