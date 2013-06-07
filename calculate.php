<?php
//Лічыць агульную колькасць баллаў за ўвесь тэст
$pattern = $_GET['pattern'];
$output = preg_replace( '/[^0-9]/', '-', $pattern );
$pieces = explode( '-', $output );
unset($pieces[0]);
unset($pieces[count($pieces)]);

if(isset($pieces)){
     $file = "xml/my.xml";
      if (file_exists($file)) {
          $xml = simplexml_load_file($file);
       } else {exit('Не удалось открыть файл xml.');}
       $sum= 0;
        foreach ($pieces as $var) {
           $weight = $xml->xpath("(//question)[".$var."]/weight");
           $sum = $sum + (int)$weight[0];           
        }
       echo json_encode($sum);
}
?>
