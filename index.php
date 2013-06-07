<?php 
// толькі дзеля тэтавай інфармацыі
// $start_time = microtime(true);//для теста затрачиваемого времени на обработку скрипта
// далучэнне канфігурацыйных файлаў
// Моўны файл пакуль не працу, патрэбна зрабіць
include 'config.inc';
include 'lang/'.$language;//Моўны файл

//пазначаны ў config.inc
$file = $xmlFile;

// праверка на істотнасць файлу
      if (file_exists($file))  {
          $xml = simplexml_load_file($file);
       } 
       else {           
           // файл не існуе, перайсці на на старонку памылкі
          header("Location: error.php?error_num=001");
          exit;
      }
        
          // Атрыманне стартавай інфармацыіі з xml файлу
          // Для даведкі як што працуе, глядзі дакументацыю па "xpath" на "http://php.net"
          $title                        = $xml->xpath("quiztitle");// Назва тэставання
          $disciplinename        = $xml->xpath("discipline");// Назва дысцыпліны
          $subject                  = $xml->xpath("subject");// Тэма тэставання
          $quizlimit                  = $xml->xpath("quizetype/quizlimit");// Колькасць пытанняў у тэсце
          $quizqnum               = $xml->xpath("qtopic/questions/question");//Змяшчае ўсю інфу пра тэст
          // count($quizqnum) агульная колькасць пытанняў xml файлу
          $showrightanswers   = $xml->xpath("//showrightanswers");// флаг аб паказе адказаў паля кожнага пытання
          $ranswersattheend   = $xml->xpath("//showrightanswersattheend");// флаг аб паказе адказаў у канты тэста

          // Праверка на дакладнасць колькасці пытанняў
          // Агульная колькасць пытанняў павінна  быць
          if( $quizlimit[0] > count($quizqnum) ) {
              header("Location: error.php?error_num=002");
              exit;
            }
            
          // Атрымаць колькасць усіх тым "topiccount", гэта і будзе памернасць глабальнага масіва для выбаркі
          
            // Колькасць усіх тым у тэсце
          $topiccount = $xml->xpath("qtopic");
         
          // атрыманне дадзеных па тэставанні.
           for( $i=0; $i <count($topiccount); $i++ ) { 
                $question = $i+1;// нумар пытання
                $arrTopic[$i] = count($xml->xpath("qtopic[".$question."]/questions/question"));// колькасць пытанняў у тэме
                $arrPercents[$i] = $arrTopic[$i]*100/count($xml->xpath("qtopic/questions/question"));// атрымліваем адсоткавыя суадносіны пытанняў з тэмы на ўсе тэставанне
                $arrNumQuestionInTopic[$i] = ceil($arrPercents[$i]*$quizlimit[0]/100);// атрымліваем колькасць пытанняў з тэмы на ўсе тэставанне
                $k[$i] = count($xml->xpath("qtopic[".$question."]/questions/question/preceding-sibling::*"))+1;
              }

   // =============== пачатак ========= Алгарытм перамешвання пытанняў  =============================
              // Лянота каментаваць =))) 

//                  .---.
//                 /     \
//                | -  - |
//               (|  ' '  |)
//                | (_) | 
//               `//=\\'
//                 (((()))
//                  )))((
//                  (())))
//                   ))((
//                   (()
//                     ))
//                    (
              
              
  $flagBegin = 1;
  $flagEnd = $arrTopic[0];

  for ($j=0; $j <count($topiccount) ; $j++)
    { 
      $rcounter = get_random_array(0, count($topiccount));
      $temppattern = t_get_random_array($flagBegin,$flagEnd,$arrNumQuestionInTopic[$j]);

      for ($i=0; $i <count($temppattern); $i++)
      { 
        $tmprpattern[] = $temppattern[$i]; 
      }

      $flagBegin = $flagEnd+1;
      if((count($topiccount)-$j)==1)
        {
          if (isset($arrTopic[count($temppattern)-1]))
              {
                $flagEnd =  $flagEnd+$arrTopic[count($temppattern)-1];
              }
        }
          else
          {
            if (isset($arrTopic[$j+1]))
              {
                $flagEnd =  $flagEnd+$arrTopic[$j+1];
              } 

          }
    }
    $mlen = count($tmprpattern);
    for ($h = 0; $h < $mlen; $h++)
      { 
        $n = rand(0, count($tmprpattern) - 1);
        $rpattern[] = $tmprpattern[$n];

        unset($tmprpattern[$n]);
        $tmprpattern = array_values($tmprpattern);
      }
      
      if($mlen != $quizlimit[0])
        {// выдаллене смецця з выбаркі
          $saber = $quizlimit[0] - $mlen;
          array_splice($rpattern, $saber);  
        }
    
// Робім масіў у які по змозчанні запісваем адказы на пытанне
  for ($i=0; $i < count($rpattern); $i++) { 
    $answers[$rpattern[$i]] = 0;
    $results[] = "no";
  }
// =============== канец ========= Алгарытм перамешвання пытанняў  =============================
 
 /*
  *  get_random_array
  * Вяртае перамяшаны масіў лікаў ад $ first +1 да $ last, памерам $ last-1;
  * 
  */ 
function get_random_array($first, $last) {    
    for ($i = $first; $i < $last; $i ++)
      {// крыніца
         $source_array[] = $i+1;
      }
    for ($i = $first; $i < $last; $i++)
      { 
        $n = rand(0, count($source_array) - 1);
        $randompattern[] = $source_array[$n];
        unset($source_array[$n]);
        $source_array = array_values($source_array);
      }
      return $randompattern;
  }

   /*
  *  t_get_random_array
  * Вяртае перамяшаны масіў лікаў ад $ first +1 да $ last, памерам $size;
  * 
  */ 
function t_get_random_array($first, $last, $size)
  {    
    for ($i = $first; $i < $last+1; $i ++)
      {// Массив - источник чисел
         $source_array[] = $i;
      }
      for ($i = 0; $i < $size; $i++)
        { 
          $n = rand(0, count($source_array) - 1);
          $randompattern[] = $source_array[$n];
          unset($source_array[$n]);
          $source_array = array_values($source_array);
        }

  return $randompattern;

  }
/*=============== канвертаванне масіва ў фармат JSON ===========================*/
$json = json_encode($answers);
setcookie ("answersarray", $json);
$json = null;
$json = json_encode($rpattern);
$setfirststat = json_encode($results);
/*================== работа з cookie =====================*/
$len = $quizlimit[0];
setcookie ("ranswersattheend","");////удаляет данное значение куки
setcookie ("ranswersattheend", $ranswersattheend[0]);//задаёт надо ли показывать правильные ответы в конце тестирования
setcookie ("showrightanswers","");////удаляет данное значение куки
setcookie ("showrightanswers", $showrightanswers[0]);//задаёт надо ли показывать правильные ответы
setcookie ("pattern","");////удаляет данное значение куки
setcookie ("pattern", $json);//задаёт шаблон выборки вопросов
setcookie ("staticPattern","");////удаляет данное значение куки
setcookie ("staticPattern", $json);//задаёт шаблон выборки вопросов
setcookie ("results","");////удаляет данное значение куки
setcookie ("results", $setfirststat);//задаёт статистику прохождения теста
setcookie ("maxresult","");////удаляет данное значение куки 

setcookie ("perquiz","");////удаляет данное значение куки 
setcookie ("perquiz", $quizlimit[0]);//задаёт количество вопросов в тесте

setcookie ("currentqstn", "");//удаляет данное значение куки 
setcookie ("currentqstn", $rpattern[$len-1]);//устанавливает первый вопрос для вывода студенту
setcookie ("answeresnum", "");//удаляет данное значение куки 
setcookie ("answeresnum", $rpattern[$len-1]);//устанавливает первый вопрос для вывода студенту
setcookie ("sumscore", 0);//начальное значение суммы баллов по всем ответам
unset($rpattern);
unset($results);
unset($answers);
/*$exec_time = microtime(true) - $start_time;
echo $exec_time;*/
?>
<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link type="text/css" href="css/jquery-ui-1.9.1.custom.css" rel="stylesheet" />
  <link type="text/css" href="css/question-style.css" rel="stylesheet" />
  <link type="text/css" href="css/jmessage.css" rel="stylesheet"  />
  <link type="text/css" href="css/style.css" rel="stylesheet"  />
  <script src="js/jquery-1.8.2.js"></script>
  <script src="js/jquery-ui-1.9.1.custom.min.js"></script>
  <script src="js/jquery-shuffle.js"></script>
  <script src="js/cdo-pfm.js"></script>
  <script src="js/jQuery-random.js"></script>
  <script src="js/jqueryrotate.js"></script>
  <script src="js/jquery.json-2.4.min.js"></script>
  <script src="js/jquery.jmessages.js" type="text/javascript"></script>

<link rel="stylesheet" href="css/jquery.tooltip.css" />
<script src="js/jquery.dimensions.js" type="text/javascript"></script>
<script src="js/jquery.tooltip.js" type="text/javascript"></script>
<script src="js/jquery.bgiframe.js" type="text/javascript"></script>


  <link rel="icon" type="image/vnd.microsoft.icon" href="images/favicon.ico">
  <link rel="SHORTCUT ICON" href="images/favicon.ico">
  <title><?php foreach($title as $node){echo $node;}?></title>
 </head>
 <script>
  $(document).ready(function()
  {/*================= Описание глобальных переменных ==================*/
   /*================== Отключает возможность отправки данных формы, через enter=========*/
    var keyStop = {
       8: ":not(input:text, textarea, input:file, input:password)", // stop backspace = back
       13: "input:text, input:password", // stop enter = submit 
       end: null
    };
 
     $(document).bind("keydown", function(event){
      var selector = keyStop[event.which];

      if(selector !== undefined && $(event.target).is(selector)) {
          event.preventDefault(); //stop event
      }
      return true;
     });
  /*======================================================*/
  
      $('#testfunctions').css("visibility","hidden");
      $('#typeofquestion').css("visibility","hidden");
      
      //
      var object = $.parseJSON(get_cookie("pattern"));
      var qnum = 0;
      $.each(object, function(key, value)
                  {//формирование массива содержащего порядок вопросов в текущем тесте
                       qnum++;
                  });

    $('#remainquestion').html(qnum);
    $('#testfunctions *').tooltip();//выводит title при наведении на элемент, для подсказок

  /*================= Обработка кнопки "Начать тестирование" =================*/
    $('#start-btn').click(function(){
          //Включаем видимость кнопок
          $('#testfunctions').css("visibility","visible");
          $('#typeofquestion').css("visibility","visible");
          $('#okbut').css("visibility","visible");
          $('#skipbut').css("visibility","visible");
          
          
        
      
        //======================================
          var id = parseInt(get_cookie("currentqstn"));//получение номера вопроса
          var url = "respond.php?qstn-number=" + id; //формирование ссылки для ajax-запроса 
         
          showanswer(url);//вывод вопроса
          get_next_question();//
          
    });
    /*================= Обработка кнопки "Ответить" =================*/
    $('#okbut').click(function(){
      var id = parseInt( get_cookie("currentqstn") );//получаем текущий номер вопроса
      var pid = parseInt( get_cookie("prevqstn") );//получаем предыдущий номер вопроса
      
      set_cookie("answeresnum", id);      
      var url = "respond.php?qstn-number=" + id;
      
      var qweight = parseInt( get_cookie("weight_by_question") );
      var category = get_cookie("category");
      var showrightanswer = get_cookie("showrightanswers");

      set_score( qweight, pid, category );      

      //$.jmessage('Ваш ответ принят', '',2000, 'jm_message_success');
      
       if(get_next_question_ok( id )) {
          if(showrightanswer == "true") {
              //$('#res').html("Test text showrightanswer");

              _showrightanswer();
              $('#okbut').css("visibility","hidden");
              $('#skipbut').css("visibility","hidden");
              $('#nextbut').css("visibility","visible");

            }
              else  { showanswer( url ); }
          
        } 
      
      var object = $.parseJSON(get_cookie("pattern"));
      var qnum = 0;
      $.each(object, function( )
                  {//формирование массива содержащего порядок вопросов в текущем тесте
                       qnum++;
                  });
      
      $('#remainquestion').html(qnum);
        
    });
    
    /*================= Обработка кнопки "Пропустить" =================*/
    $('#skipbut').click(function(){
          var id = parseInt(get_cookie("currentqstn"));
          //set_cookie("answeresnum",id);
          var url = "respond.php?qstn-number=" + id;
          showanswer(url);//вывод вопроса
          get_next_question();
    });

     $('#nextbut').click(function(){
          var id = parseInt(get_cookie("currentqstn"));
          var url = "respond.php?qstn-number=" + id;
              $('#okbut').css("visibility","visible");
              $('#skipbut').css("visibility","visible");
              $('#nextbut').css("visibility","hidden");
          showanswer(url);//вывод вопроса

    });

 $('#hardfinish').click(function() {
        show_results();
    });
  });
 
 </script>
 <body>
  <div id="contaner">
    <header>
            <div id="header">
            <div id="logo"><img src="/images/system/logo.png" width="70" height="85" alt="логотип"></div>
            <div id="nameoftest"><?php foreach($disciplinename as $node){echo $node;}?></div>
                <div id="typeoftest">
                  <div id="curdate"><?php echo $Today.' '.date("d-m-Y");?></div>
                </div>
            <div id="testdata">
                <div id="testtime"><?php if($TimeLimit<>0){echo $RemTime;}else {echo $RemTimeTrening;}?><div id="remtime"></div></div>
              <div id="testsubject"><?php foreach($subject as $node){echo $node;}?></div>
            </div>
            <div id="testfunctions"><span id="hardfinish"><?php echo $AbortTest;?></span>&nbsp;&nbsp;<span title="Досрочное завершение тестирования. Будет выставлена отметка"><img src="/images/system/info.png" atl="информация"/></span></div>

            <div id="typeofquestion"><?php echo $QuestionLimit.": ".$quizlimit[0]."<br>".$Remain.": ";?><span id='remainquestion'></span></div>
        </div>
    </header>
        <div id="content" align="center">
          <div id="res">
 
            <div id="start-btn" title="<?php echo $startbtntitle;?>"><?php echo $startbtn;?></div>
          </div> 
        </div>
        <div id="empty"></div>
</div>
<div id="footer">
  <div class="quiz-btn">
            <div id="okbut"   style="visibility:hidden"   title="Ответить"></div>
            <div id="skipbut" style="visibility:hidden"   title="Пропустить"></div>
            <div id="nextbut" style="visibility:hidden"   title="Далее"></div>
  </div>
        <footer>
        <div id="footer-text">&copy;&nbsp;<?php echo $copyrightName;?>, 
          <?php 
              if(date('Y')==2012){echo("2012"); }
                else{$mydate='2012&nbsp;-&nbsp;'; $curdate=date('Y');
                echo $mydate.$curdate;} 
          ?>
          <p>http://cdo.barsu.by/</p>
        </div>
        </footer>
      </div>
 </body>
</html>
