 /**
  * TODO: перенести все строки в константы и переменные
  * придумать как передавать список населённых пунктов извне.
  * придумать как передавать даты начала и окончания парсинга
  * возможно забирать всё в большем диапазоне и проверять на изменение, с дальнейшим доплнением списка
  */
 class TNSenergo{

    constructor(app){
        this.app = app;
        this.link = 'https://www.mrsk-1.ru/customers/services/transmission/disconnection/281/';
        // список населённых пунктов, по которым ведём отслеживание
        this.cityes = [
            'п. Отрадное',
            'с. Хреновое',
            'с. Бабяково',
            'Бабяково',
            'с. Новая Калитва',
        ];
        // период дней вперёд, на который мониторим отключения
        this.dayCount = 7;
        // свойство, из которого мы дёргаем результат парсинга. Если что-то пошло не так то будет просто пустой
        this.result = [];
        // функция не предназначена, для самостоятельного вызова. 
        this.parse();
    }

    /**
     * Непосредственно парсинг. Ничего не возвращает. Чтобы получить результаты, нужно или запросить метод
     * getResult или 
     */
    async parse(){
        this.page = await this.app.browser.newPage();
        this.page.setViewport({ width: 1200, height: 900 });
        await this.page.goto(this.link, { waitUntil: 'domcontentloaded' });

        // устанавливаем диапазон дат, которые будем выбирать на датапикере
        let currentTime = new Date();

        const inputStart = currentTime.toLocaleString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' });
        currentTime.setDate(currentTime.getDate() + this.dayCount);
        const inputEnd = currentTime.toLocaleString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' });

        await this.page.waitForSelector('#dls_start');
        await this.page.type('#dls_start', inputStart);
        await this.page.waitForSelector('#dls_end');
        await this.page.type('#dls_end', inputEnd);
        // если не потерять фокус, то сортировка не сработает
        await this.page.type('#dls_street', '');
        // после срабатывания фильтра нужно некоторое время, но по тегу отследить не получится. просто ждём.
        this.page.waitForTimeout(2000)
            .then(async () => {
                // передаём список населённых пунктов. Нужно добавить постобратотку, с удалением пробелов и букв населённых пунктов
                const list = this.cityes;
                try {                
                    let answer = await this.page.evaluate(async (list) => {
                        let tableClass = '.disconnection-table tr';
                        let arLocations = document.querySelectorAll(tableClass);

                        let container = [];
                        // TODO: возможно для порядка можно получать класс каждой строки. tr class="d82307E3B-9A60-43CA-A02A-D962A111E7E0" похоже, что он уникален
                        arLocations.forEach(raw => {
                            // console.log(raw);
                            let tdLocation = raw.getElementsByClassName('location');
                            // Elements возвращает массив, для этого следующая проверка, чтобы исключить заголовки таблицы
                            if (tdLocation.length > 0) {
                                // определяем, есть ли этот населённый пункт в нашем списке
                                const index = list.indexOf(tdLocation[0].innerHTML)
                                // TODO: Для воронежа, нужно получать конкретные улицы, а для этого нужно разбирать object и анализировать его
                                // не вижу другого способа кроме регулярок. Пока задвину в дальний угол.
                                
                                if (index !== -1) {

                                    const region = raw.getElementsByClassName('region')[0].innerHTML;
                                    const district = raw.getElementsByClassName('district')[0].innerHTML;
                                    const location = raw.getElementsByClassName('location')[0].innerHTML;
                                    const object = raw.getElementsByClassName('object')[0].innerHTML;
                                    const disconnDateStart = raw.getElementsByClassName('disconn-start-date')[0].innerHTML + ' ' + raw.getElementsByClassName('disconn-start-time')[0].innerHTML ;
                                    const disconnDateEnd = raw.getElementsByClassName('disconn-end-date')[0].innerHTML + ' ' + raw.getElementsByClassName('disconn-end-time')[0].innerHTML ;
                                    const branch = raw.getElementsByClassName('branch')[0].innerHTML;
                                    const res_title = raw.getElementsByClassName('res_title')[0].innerHTML;

                                    container.push({
                                        'Регион: ' : region,
                                        'Административный район: ' : district,
                                        'Населенный пункт: ' : location,
                                        'Улица: ' : object,
                                        'Дата и время начала: ': disconnDateStart,
                                        'Дата и время окончания: ': disconnDateEnd,
                                        'Филиал: ' : branch,
                                        'РЭС: ' : res_title
                                    });                                    
                                }

                            }
                        });

                        return container;
                    }, list);// второй аргумент содержит массив населённых пунктов, положил в развёрнутом виде
                    
                    // console.log(answer);
                    // answer = this.prepareAnswer(answer)
                    this.result = answer;                  
                    
                } catch (error) {
                    console.log('page empty - TNSenergo page error');
                    console.log(error);
                }
        });   
            //  console.log(this.result);
    }

    // TODO: добавить механизм проверки актуальности полученных данных. 
    // Если в чате уже есть отключение на завтра, то повторно не отправлять
    //  async prepareAnswer(countryes){
    //      let existing = [];
    //      countryes.forEach(city => {
    //          if (this.cityes.includes(city)) {
    //              existing.push(city);
    //          }
    //      })
    //      return existing;
    // }

    getResult(){
        return this.result;
    }
    
}

module.exports = TNSenergo;