<?php
$var = $_GET['qstn-number'];

      $file = "xml/my.xml";
      if (file_exists($file))
       {
          $xml = simplexml_load_file($file);
       } else {exit('Не удалось открыть файл xml.');}

          $category  	        = $xml->xpath("(//question)[".$var."]/category");
          $showrightanswers   = $xml->xpath("//showrightanswers");
          $qtype              = $xml->xpath("(//question)[".$var."]/qtype");
          $weight             = $xml->xpath("(//question)[".$var."]/weight");
        //  $title              = $xml->xpath("(//question)[".$var."]/title");
          $questionbody       = $xml->xpath("(//question)[".$var."]/questionbody");
          $trueAnswers        = $xml->xpath("(//question)[".$var."]/answers/answer[@type='true']/name");
          $falseAnswers       = $xml->xpath("(//question)[".$var."]/answers/answer[@type='false']/name");
          $comparisonAnswers  = $xml->xpath("(//question)[".$var."]/answers/answer/name");
          $comparisonresult   = $xml->xpath("(//question)[".$var."]/answers/answer/@result");
          $sortorder          = $xml->xpath("(//question)[".$var."]/answers/answer/@order");
          $currenttopicname   = $xml->xpath("(//question)[".$var."]/../../name");// - для получения наименования темы по данному вопросу

          foreach($showrightanswers as $q){$showrightanswers = $q;}

                if((string)$category[0]=="comparison")
                
                {
                  
                    for ($i=0; $i <count($comparisonAnswers); $i++)
                    { 

                        $temp ["$comparisonresult[$i]"] = "$comparisonAnswers[$i]";
                    }

                $qArray = array(

                          'category'        => (string)$category[0],
                          'topic'           => (string)$currenttopicname[0],
                          'showanswers'     => (string)$showrightanswers[0],
                          'weight'          => (string)$weight[0],
                          'qtype'           => (string)$qtype[0],
                        //  'title'           => (string)$title[0],
                          'questionbody'    => (string)$questionbody[0],
                          'answers'         => $temp,
                        );
                }
                  else{
                        if((string)$category[0]=="sort")
                        {
                          for ($i=0; $i <count($sortorder); $i++)
                            { 

                                $temp ["$sortorder[$i]"] = "$comparisonAnswers[$i]";
                            }
                            $qArray = array(

                          'category'        => (string)$category[0],
                          'topic'           => (string)$currenttopicname[0],
                          'showanswers'     => (string)$showrightanswers[0],
                          'weight'          => (string)$weight[0],
                          'qtype'           => (string)$qtype[0],
                        //  'title'           => (string)$title[0],
                          'questionbody'    => (string)$questionbody[0],
                          'answers'         => $temp,
                          );
                        }
                          else{
                                if((string)$category[0]=="filled")
                                  {
                                    $temp = array();
                                          foreach ($trueAnswers as $value)
                                            {
                                             /* $temp["$value"] = "true";*/
                                             $str = $value;
                                             $temp = explode("|", $str);
                                            }
                                      $qArray = array(

                                    'category'        => (string)$category[0],
                                    'topic'           => (string)$currenttopicname[0],
                                    'showanswers'     => (string)$showrightanswers[0],
                                    'weight'          => (string)$weight[0],
                                    'qtype'           => (string)$qtype[0],
                                   // 'title'           => (string)$title[0],
                                    'questionbody'    => (string)$questionbody[0],
                                    'answers'         => $temp,
                                    );
                                  } 
                                    else{
                                          $temp = array();
                                          foreach ($trueAnswers as $value)
                                            {
                                              $temp["$value"] = "true";
                                            }
                                          foreach ($falseAnswers as $value)
                                            {
                                              $temp["$value"] = "false";
                                            }
                                          $qArray = array(

                                                    'category'        => (string)$category[0],
                                                    'topic'           => (string)$currenttopicname[0],
                                                    'showanswers'     => (string)$showrightanswers[0],
                                                    'weight'          => (string)$weight[0],
                                                    'qtype'           => (string)$qtype[0],
                                                   // 'title'           => (string)$title[0],
                                                    'questionbody'    => (string)$questionbody[0],
                                                    'answers'         => $temp,
                                                  );
                                        }
                              }
                    }

echo json_encode($qArray);
                  /*$str = "hello|привет|ку";
                  $answers = explode("|", $str);
                  var_dump($answers);*/
?>