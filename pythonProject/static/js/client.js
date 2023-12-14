const requestURL = 'http://127.0.0.1:3000/api/snacks/'

//функция отправки запросов
function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.onload = () => {
            if (xhr.status >= 400) {
              reject(xhr.response)
            } else {
              resolve(xhr.response)
            }
        }

        xhr.onerror = () => {
          reject(xhr.response)
        }

        xhr.send(JSON.stringify(body))
    })
}

// глобальный таймер
var timer

$(document).ready(function(){
    //обработчик клика по блоку с классом numpad__row_btn
    $('div.numpad__row_btn').click(function(){
        window.clearTimeout(timer);
        $( "div.numpad__row_btn-take" ).fadeOut();
        //текущее содержание импута
        var text = $('input').val();
        //что хотим сделать
        var qwe = $(this).text();
        //очистка циферблата
        if (qwe == "C")
            $('input').val("");
        //удаление последней цифры
        else if (qwe == "<"){
            text = text.slice(0, -1)
            $('input').val(text);
        }
        else if ((text.length < 2) && (parseInt(text) != 0))
            $('input').val(text + qwe);
        text = $('input').val();
        if ((parseInt(text) > 35) || (parseInt(text) == 0)){
            setTimeout(() => {
                alert("Введен неверный номер ячейки");
            }, "50");
            //если введен некорректный номер ячейки
            $('div.numpad__row_btn-num').css({'opacity':'0.33', 'transition-duration':'0.5s'});
        }
        else
            //если на данный момент в инпуте корректный номер
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
            if ((parseInt(text) <= 35) && (parseInt(text) > 0)){
                timer = window.setTimeout(() => {
                    $('div.numpad__row_btn-num').css({'opacity':'0.33', 'transition-duration':'0.5s'});
                    sendRequest('GET', requestURL + text)
                        .then(data => {
                            if (!data)
                                alert("Товара нет в наличии")
                            else{
                                $( "div.numpad__row_btn-take" ).fadeIn();
                            }
                        })
                        .catch(err => console.log(err))
                }, "1000");
            }
    });
    $('div.numpad__row_btn-take').click(function(){
        text = $('input').val();
        sendRequest('PUT', requestURL + text, {change: -1})
        .then(data => {
            alert("Заберите товар")
            $('input').val("")
            $( "div.numpad__row_btn-take" ).fadeOut();
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
        })
        .catch(err => {
            alert("Произошла ошибка, попробуйте позже")
            $('input').val("")
            $( "div.numpad__row_btn-take" ).fadeOut();
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
        })
    });
});