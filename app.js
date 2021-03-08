let tnsClass = require('./src/parser/TNSenergo');
const App = require('./src/Wrapper');


let app = new App;
(async () =>{
    await app.getBrowser();
    let tns = new tnsClass(app);
    // console.log(tns.getResult());
    // await app.closeBrowser();

})();




/**
 * открыть браузер
 * передать его экземпляр в нужный класс
 * полученные из класса результаты положить в класс ответа
 * вывести ответ в консоль
 * вывести ответ в телеграмм
 */



