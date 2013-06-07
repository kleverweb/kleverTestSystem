/*===========================  Глабальныя =================================*/
// Падрыхтоўка аб'екта
global = new Object();
global.questionBody = ""; // будзе змяшчаць цела пытання
global.rightAnswers = new Array(); // Массіў з адказамі



/*=========================== Канец Глабальныя =================================*/

/*===========================  Служэбныя =================================*/

/*
 * set_cookie
 *
 * Задаць кукі
 *
 * @param {type} name
 * @param {type} value
 * @param {type} exp_y
 * @param {type} exp_m
 * @param {type} exp_d
 * @param {type} path
 * @param {type} domain
 * @param {type} secure
 * @returns {undefined}
 */
function set_cookie ( name, value, exp_y, exp_m, exp_d, path, domain, secure ) {
          var cookie_string = name + "=" + escape ( value );
          if ( exp_y )  {
                  var expires = new Date ( exp_y, exp_m, exp_d );
                  cookie_string += "; expires=" + expires.toGMTString();
              }
          if ( path )
                cookie_string += "; path=" + escape ( path );
          if ( domain )
                cookie_string += "; domain=" + escape ( domain );
          if ( secure )
                cookie_string += "; secure";
          document.cookie = cookie_string;
}

/*
 * Атрымаць кукі
 *
 * @param {type} cookie_name
 * @returns {unresolved}
 */
function get_cookie ( cookie_name )  {
          var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
          if ( results )
            return ( unescape ( results[2] ) );
          else
            return null;
}

/*
 * Выдаліць кукі
 *
 * @param {type} name
 * @param {type} path
 * @param {type} domain
 * @returns {Boolean}
 */
function delete_cookie(name, path, domain) {
    set_cookie(name, null, new Date(0), path, domain);
    return true;
}

/*
 * Толькі для вываду масіваў, як у var_damp PHP
 *
 * @param {type} obj
 * @param {type} k
 * @returns {unresolved}
 */
function dump(obj, k) {
    var out = "";
    if(obj && typeof(obj) == "object"){
        for (var i in obj) {
            if(k!=obj[i])   {
              out += obj[i];
            }
       }
    } else {  out = obj; }
    return out;
}
/*
 * Толькі для вываду масіваў, як у var_damp PHP + нумар элементу і кожны наструпны з новага радка
 *
 * @param {type} obj
 * @param {type} k
 * @returns {unresolved}
 */
function vardump(obj) {
    var out = "";
    if(obj && typeof(obj) == "object"){
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }
    } else {
        out = obj;
    }
    alert(out);
}
/*=========================== Канец  Служэбныя =================================*/

/*
 * Выводзіць пытанне
 * Ізде запыт да repspond.php, дзе фарміруецца массіў пасылаецца ў адказе як радок JSON
 * Парсіцца адказ з сервера, пасля ізде праверка які тып пытання і ў адпаведнасці з гэтым друкуецца пытанне
 *
 * @param {str} url
 * @returns {undefined}
 */
function showanswer(url) {
  $.ajax(
                {
                  url: url,
                  cache: false,
                  success: function(transport) {
                                          $.getJSON(url, function(json) {
                                                 global.questionBody = json.questionbody;//Тело вопроса
                                                 global.rightAnswers = json.answers;
                                                 var category = json.category;//Категория вопроса                                                
                                                 var qtype = json.qtype;//Тип вопроса                                                
                                                 var showanswers = json.showanswers;//значение о том показывать ли правильные-неправильные ответы
                                                 var weight_by_question = json.weight;//вес ответа
                                                 var topic = json.topic;
                                                 // var inputsize = json.inputsize;//Размер инпута
                                                 
                                                 /*============== вылучэнне памяці і заданне пачатковых значэнняў зменных ============*/
                                                 var singlestr="";
                                                 var multiplystr="";
                                                 var i=1;
                                                 var nid = 0;
                                                 var sortstr = "";

                                         /*====================== запіс значэнняў у кукі ======================*/
                                         delete_cookie("weight_by_question");//очистим куки
                                         set_cookie("weight_by_question", weight_by_question); // запись в куки веса ответа
                                         delete_cookie("category");//очистим куки
                                         set_cookie("category", category);// запись в куки типа вопроса
                                         delete_cookie("answers");//очистим куки
                                         set_cookie("answers", global.rightAnswers);// запись в куки типа вопроса
                                         
                                          /*====================== Вывод вопроса типа "Ввод значения" ============================*/
                                           // Выпадак, калі ты пытання "увод слова"
                                          if(category == "filled") {
                                                 // Робім радок адказаў, калі патрэбна цераз '|'
                                                 var str="";                                         
                                                 $.each(global.rightAnswers, function( key, value ) {
                                                      str = str+value+"|";
                                                   });
                                                  
                                                 // Падрыхтоўка html устаўкі
                                                 fillquestionhtml="<div id='topicname'>"+topic+"</div>\n\
                                                                             <div id='res-category'>Тип вопроса: '"+qtype+"'</div>\n\
                                                                             <div id='res-title'>"+global.questionBody+"</div>\n\
                                                                             <div id='res-body'>\n\
                                                                                    <form method='post' action='#' >\n\
                                                                                           <div id='text' showanswr='"+showanswers+"'>\n\
                                                                                                  <input id='fill' type='text' name='"+str+"'/>\n\
                                                                                           </div>\n\
                                                                                    </form>\n\
                                                                             </div>";
                                                 $('#res').html(fillquestionhtml);
                                                 //$('#fill').click(function(){$.jmessage('Подсказка!', 'При вводе используйте то-то и то -то!', 3000, 'jm_message_warning');});
                                        }
                                        
                                        /*======================Вывод вопроса типа "Выбор одного правильного"============================*/
                                        if(category == "single") {
                                             //просмотр вариантов ответов
                                            $.each(global.rightAnswers, function( key, value ) {
                                               singlestr=singlestr+"<li type='"+value+"'><div class='answers'>"+key+"</li>";
                                            });                                            
                                           
                                            fillquestionhtml="<div id='topicname'>"+topic+"</div>\n\
                                                                      <div id='res-category'>Тип вопроса: '" +qtype+ "'</div>\n\
                                                                      <div id='res-title'>" +global.questionBody+ "</div>\n\
                                                                      <div id='res-body'><form method='post' action='#'>\n\
                                                                      <ol id='selectable' showanswr='true'>"+singlestr+"</ol></form></div>";
                                            
                                            $('#res').html(fillquestionhtml);                                           
                                            
                                            // зрабіць спіс вылучаемым толькі для аднаго
                                            $("#selectable").selectable(
                                               {
                                                  filter:"li",
                                                  selected: function(event, ui)
                                                      {
                                                        $(ui.selected).siblings().removeClass("ui-selected");
                                                        $(ui.selected).siblings().addClass("ui-des");
                                                        temp = $(ui.selected).attr("type");
                                                      }
                                                }
                                                );
                                          
                                          // перамешваць спіс
                                          $('ol li').shuffle();
                                        }
                                        
                                        /*======================Вывод вопроса типа "Выбор нескольких правильных"============================*/
                                        if(category == "multiply") {
                                            $.each(global.rightAnswers, function( key, value ) {
                                              multiplystr=multiplystr+"<li nid="+nid+" type='"+value+"' score='5' class='ui-selectee'>\n\
                                                                                    <div class='answers'><input id='chbx-"+i+"' class='multi-answ' type='checkbox' name='first'>\n\
                                                                                    <label for='chbx-"+i+"'>&nbsp;&nbsp;"+key+"</label></div></li>";
                                              i=i+1;
                                              nid++;
                                            });
                                            
                                            fillquestionhtml="<div id='topicname'>"+topic+"</div>\n\
                                                                      <div id='res-category'>Тип вопроса: '" +qtype+ "'</div>\n\
                                                                      <div id='res-title'>" +global.questionBody+ "</div>\n\
                                                                      <div id='res-body'><form method='post' action='#'>\n\
                                                                      <ol id='muliply' showanswr='true' >"+multiplystr+"</ol></form></div>";
                                            
                                            $('#res').html(fillquestionhtml);
                                             
                                            // зрабіць спіс вылучаемым 
                                            $(".multi-answ").change(function()
                                              {
                                                $(this).closest('li').toggleClass("ui-selected", this.checked);
                                              });

                                            $('ol li').shuffle();
                                          }
                                          
                                          /*======================Вывод вопроса типа "Сопоставление"============================*/
                                        if(category == "comparison") {
                                            var str = "";
                                            var k=0;
                                            var counter=0;
                                            var counter1=0;
                                            var results = new Array();
                                            var test = new Array();
                                            var strres ="";
                                            
                                            // фарміраванне масіва адказаў
                                            $.each(global.rightAnswers, function(key, value) {
                                              results[counter] = value;
                                              counter = counter+1;
                                            });
                                            
                                            delete_cookie("length");//очистим куки
                                            set_cookie("length", results.length);// запись в куки типа вопроса

                                            
                                            $.each(global.rightAnswers, function( key, value )//просмотр вариантов ответов
                                            {
                                              str = "<li id ="+k+"><div id='line'>"+key+"</div><div id='arrow'>\n\
                                                        <img src='/images/system/arrow.png'></div><div id='select'><select id='select-"+k+"'>";
                                              var strbody = "<option selected type='null'>-- Выберите утверждение--</option>";
                                              for (var i = 0; i < counter; i++) {
                                                    if(results[i]==value) {
                                                      strbody = strbody + "<option type='true'>"+results[i]+"</option>";
                                                    }
                                                      else  {
                                                        strbody = strbody + "<option type='false'>"+results[i]+"</option>";
                                                      }
                                                };

                                              var strend ="</select></div></li>";
                                              strres =str+strbody+strend;
                                              test[counter1]=strres;
                                                        k=k+1;
                                                        counter1 = counter1+1;

                                            });
                                            
                                              var resstr="";
                                              for (var i = 0; i < counter1; i++) {
                                                resstr = resstr+test[i];
                                              };

                                            fillquestionhtml="<div id='topicname'>"+topic+"</div>\n\
                                                                      <div id='res-category'>Тип вопроса: '" +qtype+ "'</div>\n\
                                                                      <div id='res-title'>" +global.questionBody+ "</div><div id='res-body'>\n\
                                                                      <form method='post' action='#'><ol showanswr='true'>"+resstr+"</ol></form></div>";
                                            
                                            
                                            $('#res').html(fillquestionhtml);
                                            $('ol li').shuffle();
                                          }
                                          
                                          /*======================Вывод вопроса типа "Упорядочивание"============================*/
                                        if(category == "sort") {
                                            var count = 0;
                                            $.each(global.rightAnswers, function( key, value )//просмотр вариантов ответов
                                            {
                                              sortstr=sortstr+ "<li class='sortitem' order='"+key+"' score='0'><div class='answers'>"+value+"</div></li>";
                                              count++;
                                            });

                                            delete_cookie("length");//очистим куки
                                            set_cookie("length", count);// запись в куки типа вопроса

                                            fillquestionhtml="<div id='topicname'>"+topic+"</div><div id='res-category'>Тип вопроса: '" +qtype+ "'</div><div id='res-title'>" +global.questionBody+ "</div><div id='res-body'><form method='post' action='#'><ol id='sortable' showanswr='true'>"+sortstr+"</ol></form></div>";
                                            $('#res').html(fillquestionhtml);
                                            $("#sortable").sortable({ cursor:"move", delay: 150,  opacity:0.5, axis: "y"});// сделаем список пригодным для сортировки
                                            $('ol li').shuffle(); // перемешаем элементы нашего списка вопросов.
                                          }
                                       });

                                    }
                });
}

/*
 * set_score
 *  Усталёўвае заробленыя балы
 * 
 * @param {float} qweight
 * @param {integer} id
 * @param {string} category
 * @returns {undefined}
 */
function set_score( qweight, id, category )  {
    var object = $.parseJSON(get_cookie("answersarray"));
    var answersarray = new Array();
    var temporary = new Array();
    
      $.each(object, function(key, value)
            {//формирование временного массива содержащего порядок вопросов в текущем тесте
                  if( id == key ) {
                      temporary[key] = qweight;
                    }
                      else  {
                        temporary[key] = value;
                      }
            });
  for (var i = 1; i < temporary.length; i++) {//танцы с бубном, что бы исключить пустое значение нулевого элемента
    answersarray[i] = temporary[i];
  };
  
  /*============= проверка правильности ответа на вопрос =============*/
  if(category == "filled"){t_check_filled(qweight);}
    if(category == "single"){t_check_single(qweight);}
      if(category == "multiply"){t_check_multiply(qweight);}
        if(category == "comparison"){t_check_comparison(qweight);}
          if(category == "sort"){t_check_sort(qweight);}
          
  /*============= устанавливает новый шаблон вопросов =============*/
    var temp = $.toJSON(answersarray);
    delete_cookie( "answersarray" );
    set_cookie("answersarray", temp);
    
  /*========== освобождение памяти ========== */
    answersarray = null;
    temporary     = null;
    object            = null;
  }
   

function t_check_filled(qweight) {//проверка ответа на вопрос типа "Ввод значения"
  var myString = $("#fill").attr("name");//получение правильных ответов из атрибута тэга
  var myArray = myString.split("|");//разложение строки на массив ответов

     /*========== обработка случая, когда ошиблись при составлении теста и добавили лишний(-е) символ(-ы) "|" ==========*/
  for (var i = myArray.length - 1; i >= 0; i--)
    {//удаление пустых ответов, если такие случайно появились
      if(myArray[i]=="") myArray.splice(-1,1);
    };

     if($("#fill").val().length>0)
      {// проверка на наличие текста в инпуте
        var sum = 0;//начальное значение суммы баллов за ответ
        var my = new Array();//Не забыть доделать проверку для нескольких введёных слов
        var answer = $("#fill").val();//получает введённую  в input студентом строку
        for (var i = 0; i < myArray.length; i++)
          {//проход по массиву ответов, сравнение строки с правильными ответами
            if(myArray[i].toUpperCase() == answer.toUpperCase())
              {
                my[i]=1;
                sum = sum+my[i];
              }
              else
              {
                my[i]=0;
                sum = sum+my[i];
              }
          };

            if(sum>0){//если введено верное слово
                $("#fill").attr("disabled","disabled");//убрать возможность рекдактировать строку
                //$.jmessage('Верный ответ!', 'Вы набрали: '+qweight+'% за это задание Поздравляем, так держать!  ', 1000, 'jm_message_success');
                set_sumscore(qweight)//добавить результат к общему по тесту
                }
            else  {//если не верно введено слово
                    $("#fill").attr("disabled","disabled");//убрать возможность рекдактировать строку                    
                    //qweight = 0;//полученно баллов
                    //$.jmessage('Неверный ответ!', 'Вы ответили не верно, набрав '+qweight+'% за это задание !  ', 1000, 'jm_message_error');
                   set_sumscore(0)//добавить результат к общему по тесту
                  }

      }
        else
          {//если отправлена пустая форма
            //qweight = 0;//полученно баллов
            set_sumscore(0)//добавить результат к общему по тесту
            //$.jmessage('Не введен ответ!', 'Пожалуйста, напишите ответ в поле для ввода!  ', 3000, 'jm_message_error');
          }
}
    function t_check_single(qweight)
      {//проверка ответа на вопрос типа "Выбор одиного правильного ответа"

         if($(".ui-selected").attr("type") == "true")//проверка атрибута выбранного ответа
          {
            set_sumscore(qweight)//добавить результат к общему по тесту
          }
            else
              {
                //qweight = 0;//полученно баллов
                set_sumscore(0)//добавить результат к общему по тесту
              }
      }
    function t_check_multiply(qweight)
      {//проверка ответа на вопрос типа "Выбор нескольких правильных ответов"
        //alert("Выбор нескольких правильных ответов");
        //обьявить переменные
        var patternArray          = new Array();
        var answerChoosedArray    = new Array();
        var answerUnChoosedArray  = new Array();
        var sum = 0;
        //сформирование массива правильного порядка ответов
           $("ol li").map(function(key, element)
            {
              patternArray[$(element).attr("nid")] = $(element).attr("type");
            });
              //переменная хранящая количкство ответов в вопросе
              var count = patternArray.length;
              //отметка за правильный выбор
              var answerScore = qweight/count;
              //формирование массива ответов испытуемого
                $("ol li").map(function(key, element)
                    {
                      if($(element).attr("class") == "ui-selectee ui-selected")
                        {
                          answerChoosedArray[$(element).attr("nid")] = "true";
                        }
                          else
                              {
                                 answerChoosedArray[$(element).attr("nid")] = "false";
                              }
                    });
                      //сравнение вышесозданных массивов и подсчёт баллов за задание
                      for (var i = 0; i < count; i++)
                        {
                            if(patternArray[i]==answerChoosedArray[i])
                              {
                                sum = sum + answerScore;
                              }
                        };
                          //Записать в  глобальный массив значение баллов, полученных за это задание
                          set_sumscore(sum)
        //освобождение памяти
        var patternArray          =  null;
        var answerChoosedArray    =  null;
        var answerUnChoosedArray  =  null;
      }
    function t_check_comparison(qweight)
      {//проверка ответа на вопрос типа "Упорядочивание"

        var sum = 0;
        //сформирование массива правильных  ответов
              var count = parseInt(get_cookie("length"));
              var score_by_answer= qweight/count;
             $("ol li").each(function(key, element)
              {
               if($("#select-"+key+"").find(":selected").attr("type") == "true")
                {
                 sum = sum + score_by_answer;
                }
              });
        set_sumscore(sum);

        //освобождение памяти
        var patternArray          =  null;
      }
    function t_check_sort(qweight)
      {//проверка ответа на вопрос типа "Сортировка"

        var sum = 0;
        var count = parseInt(get_cookie("length"));
        var score_by_answer= qweight/count;

       $("ol li").each(function(key, element)
        {
          if(key+1 == $(element).attr("order"))
            {
              sum = sum + score_by_answer;
            }
        });
       set_sumscore(sum);

      }
function closequiz()
  {
    var rightansrerintheend = get_cookie("ranswersattheend");
    if(rightansrerintheend == "true")
      {
        if (confirm("Тестирование завершено. Посмотреть правильные ответы?"))
          {
            showrightanswers();
          }
          else{
           show_results();
          }
      }
      else
      {
        show_results();
      }
  }

/*
 * set_sumscore
 *
 * Усталёўвае вагу адказу, якую атрымаў юзер
 *
 * @param {integer} qweight
 * @returns {void}
 */
function set_sumscore(qweight) {
     var tmp = parseInt(get_cookie("sumscore"));
      tmp = tmp + qweight;
      set_cookie("sumscore", tmp);
      tmp = 0;
  }

/*
 * get_next_question_ok
 *  Атрымаць нумар настунага пытання, калі націснута кнопка "Адказать"
 *
 * @param {integer} myid
 * @returns {Boolean}
 */
function get_next_question_ok(myid) {
       var pid = parseInt(get_cookie("prevqstn"))
       if(myid == pid) {
           closequiz();
           $('#okbut').css("visibility","hidden");
           $('#skipbut').css("visibility","hidden");
           return false;
         }
      else{
            if(isNaN(myid) == true){closequiz();}
                else{
                      var obj = $.parseJSON(get_cookie("pattern"));
                      var pattern = new Array();
                      $.each(obj, function(key, value)
                            {//формирование массива содержащего порядок вопросов в текущем тесте
                                  pattern[key] = value;
                            });
                      for (var i = pattern.length - 1; i >= 0; i--)
                          {
                            if(pid == pattern[i]){pattern.splice(i,1);break;}
                          };
                      for (var i = pattern.length - 1; i >= 0; i--)
                          {
                            if((pattern[i] == myid)&&(myid == pattern[0]))
                              {
                                var next = pattern.length-1;
                                break;
                              }
                                else
                                  {
                                    if(pattern[i] == myid)
                                      {
                                        var next = i-1;
                                        break;
                                      }
                                  }
                          };

                      var temp = $.toJSON(pattern);
      /*===================== работа с cookie =====================*/
                      if(pattern.length == 0)
                        {
                          pattern = null;
                          delete_cookie( "pattern" );
                          delete_cookie( "currentqstn" );
                          delete_cookie( "prevqstn" );

                        }
                          else
                          {
                            delete_cookie( "pattern" );
                            set_cookie("pattern", temp);//устанавливает новый шаблон вопросов
                            delete_cookie( "prevqstn" );
                            set_cookie ( "prevqstn", myid );//устанавливает предыдущий номер вопроса
                            delete_cookie( "currentqstn" );
                            set_cookie ( "currentqstn", pattern[next] );//устанавливает следующий номер вопроса
                          }
                          return true;
                  }
      }
    }

/*
 * get_next_question
 *  Атрымаць нумар настунага пытання, калі націснута кнопка "Прапусціць"
 *
 * @param {}
 * @returns {Boolean}
 */
function get_next_question() {
  var myid = parseInt(get_cookie("currentqstn"));
  if(isNaN(myid) == true) {    closequiz();  }
      else {
          var obj = $.parseJSON(get_cookie("pattern"));
          var pattern = new Array();
         // var patternnew = new Array();
          $.each(obj, function(key, value)
              {//формирование массива содержащего порядок вопросов в текущем тесте
                    pattern[key] = value;
              });
          for (var i = pattern.length - 1; i >= 0; i--) {
                 if((pattern[i] == myid)&&(myid == pattern[0])) {
                         var next = pattern.length-1;
                         break;
                 }
                  else {
                      if(pattern[i] == myid) {
                          var next = i-1;
                          break;
                        }
                 }
            };

   //устанавливает предыдущий номер вопроса
   delete_cookie( "prevqstn" );
   set_cookie ( "prevqstn", myid );

   //устанавливает следующий номер вопроса
   delete_cookie( "currentqstn" );
   set_cookie ( "currentqstn", pattern[next] );
        }
 }


/*
* show_results
*
* пасылае get запыт, каб атрымаць агульную суму баллаў
* падлік вынікаў па тэсту і вывад на манітор
*
 * @returns {undefined} */
function show_results( ) {
       //get pattern
        var pattern = get_cookie("staticPattern");
        var url = 'calculate.php?pattern='+pattern;
        // паслаць get запыт, каб атрымаць агульную суму баллаў
       $.ajax( {
                url: url,
                cache: false,
                success: function( ) {
                                        $.getJSON(url, function(json) {
                                                var maxresult = json;
                                                 $('#typeofquestion').css("visibility","hidden");
                                                 var studentresult = get_cookie("sumscore");
                                                 if(studentresult == null){studentresult = 0;}
                                                 var percents = studentresult*100/parseInt(maxresult);
                                                 var myhtml = "<p><h1>Тестирование завершено!</h1></p>\n\
                                                                         <p><h3>Вы набрали: "+studentresult+" из "+maxresult+" возможных баллов<h3></p>\n\
                                                                         <p><h3>Данный результат составляет: "+Math.round(percents)+" %<h3></p>";
                                                 $('#res').html(myhtml);
                                                 $('#testfunctions').css("visibility", "hidden");
                                        });
                               }
       });
}
//
//
//function set_right() {
//      var qnum = get_cookie("prevqstn");
//      //alert(qnum);
//      var obj = $.parseJSON(get_cookie("results"));
//              var results = new Array();
//              $.each(obj, function(key, value)
//                  {//формирование массива содержащего порядок вопросов в текущем тесте
//                        results[key] = value;
//                  });
//              vardump(results);
//}


/*
 * _showrightanswer
 * Паказвае правільныя адказы пасля кожнага адказу
 *
 * @returns {undefined}
 */
function _showrightanswer()
  {//показывает правильные ответ
      //var anid = parseInt(get_cookie("prevqstn"));//получаем предыдущий номер вопроса
       $('#res').html("<h2>Ответ на вопрос:</h2> <br><span><div id='res-title'>" +global.questionBody+ "</div>");

       /* $.each(qanswers, function( key, value )//просмотр вариантов ответов
          {

          });*/
      vardump(qanswers);
  }


function showrightanswers()
  {//показывает правильные ответы за все тестирование

      $('#res').html("показывает правильные ответы за все тестирование");

  }