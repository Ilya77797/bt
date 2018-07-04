window.addEventListener('DOMContentLoaded', function() {
    var Remove=true;
    var wasTriggered=false;// Был ли запрос за настройками на сервер
    var isAndroid=false;
    var isAlreadySaved;
    var startPoint={};
    var userSettings={
        curPrice:{}
    };

    var historyCat={//объект для работы с текущими категориями
        div:null,
        pointers:[]
    };
    var touchCoords={//Координаты касания пальцем экрана
        X:null,
        Y:null
    };

    var activeCatPointer=null; //Указатель на текущую категорию
    var currentCat=null;
    var isMobileVersion=false;
    var showPictures=true;

    chechForMobile();
    isAndroid=isFAndroid();
    addEvents();
    addSubhistory();
    if(!getStateCookie()){
        getCats();
        SearchData(false,true);
    }
    else {
       getCats(true);
    }

    setShowingTotalPrice();


    function clear(id) {
        var hasSubh=false;
        var subhPointer=null;
        var element = document.getElementById(id);
        while (element.firstChild) {
            if(element.firstChild.classList.contains('subcatHistory')){
                hasSubh=true;
                subhPointer=element.firstChild;
            }

            element.removeChild(element.firstChild);
        }
        if(hasSubh){
            element.appendChild(subhPointer);
        }

    }

     function renderCat(mass, needSinh) {
        var isAnActiveCat=false;
        var promise=new Promise((resolve, reject)=>{
            resolve();
        })
            .then(()=>{
                clear('categor');
            })
            .then(()=>{
                var div = document.getElementById('categor');
                if(mass[0]=='Нет таких категорий'){
                    var div_2=document.createElement('div');
                    div_2.textContent='Нет таких категорий';
                    div.appendChild(div_2);

                }
                else{

                    //renderAllProductsCat(div);
                    mass.forEach(function (item) {
                        generateSubCat(item, div, true);
                    });

                    if(isAnActiveCat==false&&currentCat!=null){
                        var div_2=document.createElement('div');
                        div_2.classList.add('categor-item','categor-item-active');
                        div_2.appendChild(currentCat);
                        div.insertBefore(div_2, div.firstElementChild);
                    }
                }
            if(needSinh)
                SearchData(false,true);
            });




    }
    function renderAllProductsCat(div1) {
        var div=div1|| document.getElementById('categor');
        var div_2=document.createElement('div');
        div_2.classList.add('categor-item');
        var a = document.createElement('a');
        a.setAttribute('data-info', 'allProducts');
        a.setAttribute('href','#');
        a.textContent = 'Все товары ';
        div_2.appendChild(a);
        div.insertBefore(div_2,div.firstChild);
    }

    function renderHistoryCat(prevCat) {

        var div=document.getElementById('categor');
        var a=document.createElement('a');
        a.setAttribute('data-info', prevCat.firstChild.dataset.info);
        a.setAttribute('href','#');

        a.textContent='Назад';
        if(historyCat.div==null){
                    Remove=false;

                document.getElementById('SUBH').remove();
                var div_2=document.createElement('div');
                div_2.classList.add('subcatHistory');
                div_2.setAttribute('id','SUBH');




            var aAllPr = document.createElement('a');
            aAllPr.setAttribute('data-info', 'allProducts');
            aAllPr.setAttribute('href','#');
            aAllPr.textContent = 'Все товары ';

            div_2.appendChild(aAllPr);
            div_2.appendChild(a);
            historyCat.div=div_2.cloneNode(true);
            let pointer={
                name:aAllPr.dataset.info,
                div:null
            }
            historyCat.pointers.push(pointer);
        }
        else{

            historyCat.div.remove( historyCat.div.firstChild);
            historyCat.div.appendChild(a);


        }

        if(isMobileVersion){
            var categor= document.getElementById('categor');
            categor.insertBefore(historyCat.div, categor.firstChild)

        }
        else {
            var topMenu=document.getElementsByClassName('topMenu')[0];
            topMenu.insertBefore(historyCat.div, topMenu.firstChild);
        }



        let pointer={
            name:prevCat.firstChild.dataset.info,
            div:prevCat
        }
        historyCat.pointers.push(pointer);
        if(historyCat.pointers.length>1)
            rerenderCurentHistoryCat();

    }

    function generateSubCat (item, div, flag) {//rendering subcat
        var div_2=document.createElement('div');
        div_2.classList.add('categor-item');
        if(!flag)
            div_2.style.display='none';
        var a = document.createElement('a');
        a.setAttribute('data-info', item.name);
        a.setAttribute('href','#');
        a.textContent = item.name;
        if(currentCat!=null&&item==currentCat.getAttribute('data-info')){
            div_2.classList.add('categor-item-active');
            isAnActiveCat=true;
        }

        div_2.appendChild(a);
        div.appendChild(div_2);
        if(item.subcat!='null'){
            //For mobile
            let subcatIcon=document.createElement('img');
            subcatIcon.src="images/vpravo.png"
            div_2.appendChild(subcatIcon);
            item.subcat.forEach(function (item) {
                generateSubCat(item, div_2);
            });
        }
    }

    function showSubcats(e){
        if(e.target.classList.contains('categor-item'))
        {
            let children=e.target.childNodes;
            children.forEach((item)=>{
                item.style.display='block';
            });
        }
    }

     function renderData(mass,f, hasSubcats,  statePage) {

        var ul=document.getElementById('PR');
        ul.classList.remove('awaitSearch');
        var ul=document.getElementById('PR');
        var products=mass.Products;
        var login=mass.login;
         if(login)
             var User=mass.User;
        var pages=mass.PageCount;
        var promise=new Promise((resolve, reject)=>{
            resolve();
        })
            .then(()=>{
                clear('PR');
            })
            .then(()=>{
                if(products==undefined)
                {
                    var li=document.createElement('li');
                    li.textContent='По вашему запросу ничего не найдено';
                    li.style.textAlign = "center";
                    ul.appendChild(li);
                    try {
                        document.getElementById('light-pagination').firstElementChild.remove();
                    }
                    catch (e){

                    }
                    return ;

                }
                if(products[0]=='no')
                {
                    var li=document.createElement('li');
                    li.textContent='Выберете подкатегорию';
                    li.style.textAlign = "center";
                    ul.appendChild(li);
                    try {
                        document.getElementById('light-pagination').firstElementChild.remove();
                    }
                    catch (e){

                    }


                    if(!hasSubcats){
                        li.textContent='В этой категории пока ничего нет';
                    }

                    return ;
                }


                products.forEach((item)=>{
                    var isOrdered=false;
                    try{
                        let mass=getCookie('orderId').split(';');
                        var index=-1;

                        mass.forEach((str,i)=>{
                            if(str.includes(item._id))
                                index=i;
                        });
                        if(index!=-1)
                           isOrdered=true
                    }
                    catch (e){

                    }

                    var li=createElements(item, login, User, isOrdered);

                    ul.appendChild(li);

                });
                if(isMobileVersion){
                    document.getElementsByClassName('products')[0].scrollTop=0;
                }
                else{
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                }


                if(!f){//Запрос не по номеру страницы
                    if(pages>1){
                   try{
                       $('#light-pagination').pagination({
                           displayedPages: 3,
                           edges:1,
                           items: pages,
                           cssStyle: 'light-theme',
                           prevText: 'Пред',
                           nextText: 'След',
                       });
                   }
                   catch (err){

                   }
                    }
                    else{
                        try{
                            document.getElementById('light-pagination').firstElementChild.remove();
                        }
                        catch(e){
                            console.log('Ошибка: ',e);
                        }

                    }
                }


            });




    }



function getCats(needSinh) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/searchCat', true);
        xhr.send('');
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                if(needSinh){

                    renderCat(JSON.parse(xhr.response), needSinh)

                }
                else
                    renderCat(JSON.parse(xhr.response))

            }
        }


}

    function SearchData(f,isMain, hasSubcats, Swipe) {

        var statePge=-1;


        var ul=document.getElementById('PR');
        ul.classList.add('awaitSearch');
        var li=document.createElement('li');
        li.setAttribute('id','waitForLoading');
        li.textContent='Подождите, идет загрузка...';
        li.style.textAlign = "center";
        ul.appendChild(li);


        var stateObj=getStateCookie();
        if(!stateObj)
        {

            var textS=document.getElementById('dataSearch').searchD.value;
            var PageS;
            var categor;
            if(currentCat==null)
                categor=null;
            else
                categor=currentCat.getAttribute('data-info');


            if(document.getElementById('light-pagination').firstChild!=undefined){
                var curPage=$('#light-pagination').pagination('getCurrentPage');
                if(Swipe)//true--swipeLeft, false--swipeRight
                    PageS=curPage+1;
                else if(Swipe!=undefined)
                    PageS=curPage-1;
                else
                    PageS=curPage
                if(PageS<=0)
                    PageS=1
                var pageCount=$('#light-pagination').pagination('getPagesCount');
                if(PageS>pageCount)
                    PageS=pageCount;
                 $('#light-pagination').pagination('drawPage', PageS);
            }
            else
                PageS=1;
            if(f==undefined)
                f=false;
            var sort=document.getElementById('chooseSort').options[document.getElementById('chooseSort').selectedIndex].value;
            var req={
                text:textS,
                page:PageS,
                cat:categor,
                flag:isMain,
                isPageS:f,
                sort:sort
            };
        }
        else {
            f=true;
            showPictures=(stateObj['showIm']=='true');
            setImgShowOrNot();
            if(stateObj['page']>1)
                f=false

            if(stateObj['searchText']=='')
                isMain=false;

            var req={
                text:stateObj['searchText'],
                page:stateObj['page'],
                cat:stateObj['categor'],
                flag:isMain,
                isPageS:f,
                sort:stateObj['sort']
            };
            setCookie('state','');

            document.getElementById('chooseSort').options[parseInt(stateObj['sort'])+1].selected=true;

            if(isMain)
                document.getElementById('dataSearch').searchD.value=stateObj['searchText'];






        }




        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/searchData', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(req));
        xhr.onreadystatechange = function () {


            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                var promise=new  Promise((res,rej)=>{
                    res();
                })
                    .then(renderData(JSON.parse(xhr.response),f, hasSubcats))
                    .then(()=>{
                    if(!f&&stateObj!=false)
                        try {
                            $('#light-pagination').pagination('selectPage',stateObj['page'] );
                        }
                        catch (err){

                        }

                    })
                    .then(()=>{
                    if(stateObj==false)
                        return

                    var targetCat=stateObj['categor'];
                    if(targetCat=='')
                        return



                    var categors=document.getElementById('categor');
                    if(stateObj.history!=false){
                        Array.from(categors.getElementsByClassName('categor-item')).forEach((categor)=>{
                            var a=categor.getElementsByTagName('A');
                            Array.from(a).forEach((href)=>{
                                if(href.textContent==targetCat){
                                    switchCurentCat(href.parentNode)
                                    return
                                }
                            });

                        })
                    }


                    })
                    .then(()=>{
                    if(stateObj!=false)
                        getHistorySetHistory(stateObj['history'])
                    })

            }


        }




    }

    function addEvents() {

        var catt=document.getElementById('categor');

        if(isMobileVersion){
            document.body.addEventListener('touchmove',function(e){

                if(!checkForEnableScrolling(e.target))
                    e.preventDefault();
                else
                    return true
            }, false);
        }

       setSwipeHold();


        var photo=document.getElementById('ShowImg');
        photo.addEventListener('click',()=>{
            var photoStr=photo.getAttribute('src');
            if(photoStr.includes('hideImg')){
                photo.setAttribute('src','images/showImg.png');
                showPictures=true;
                SearchData(true, false);
            }
            else{
                photo.setAttribute('src','images/hideImg.png');
                showPictures=false;
                SearchData(true, false);
            }

        });
      //For settings
        var loginForm=document.getElementsByClassName('loginForm')[0];
        loginForm.addEventListener('click',changeSettings );
        loginForm.addEventListener('submit',clearAllCookies );
        //Dispatching submit event on button like link
        var aSubmit=document.getElementsByClassName('submit');
        Array.from(aSubmit).forEach((child)=>{
            if(child.nodeName=="A"&&child.classList.contains('submit')) {
                child.addEventListener('click', () => {
                    var loginFormA=document.getElementsByClassName('loginForm')[0].children[0];
                    loginFormA.submit();
                });
            }
        });



        //for Select
        var select=document.getElementById('chooseSort');
        select.addEventListener('change',(e)=>{
            SearchData(false, true);
        });
        //for data
        var dataForm=document.getElementById('dataSearch');
        dataForm.searchD.addEventListener('keyup',function () {
            SearchData(false,true);
        });

        dataForm.addEventListener('submit',(e)=>{
            e.preventDefault();

        });

        dataForm.searchD.addEventListener('focus',()=>{
            var s=document.getElementById('dataSearch').searchD.placeholder='';

        });

        dataForm.searchD.addEventListener('blur',()=>{
            document.getElementById('dataSearch').searchD.placeholder='Поиск товаров';
        });


        var pagination=document.getElementById('light-pagination');
        pagination.addEventListener('click',SearchDataPage);

        var cat=document.getElementById('categor');
        //event is also used for working with subcats
        cat.addEventListener('click', onclick);

        var PR=document.getElementById('PR');
        if(isAndroid){
            PR.addEventListener('touchstart',openNewWindow);//also delete from Cart
        }
        else {
            PR.addEventListener('click',openNewWindow);//also delete from Cart
        }



        var topMenu=document.getElementsByClassName('topMenu')[0];
        topMenu.addEventListener('click', topMenuFetch);

        document.body.addEventListener('scroll',()=> {

            var isMobile = getComputedStyle(document.getElementsByClassName('mobile')[0]);
            var cat=getComputedStyle(document.getElementsByClassName('categor-wrapper-fix')[0]);
            if (isMobile.display == 'none') return;

            if(cat.display=='block'){//скроллинг в категориях

                var height = '';
                try{
                    height=parseFloat(getComputedStyle(document.getElementById('header')).height);
                }
                catch (e){
                    return;
                };
                try {
                    document.getElementsByClassName('topMenu')[0].classList.remove('topMenuScroll');
                }
                catch (e){

                }
                var viewportOffset = document.getElementById('categor-wrapper').getBoundingClientRect();
                var top = viewportOffset.top;

                if (top <0) {
                    document.getElementsByClassName('catS')[0].classList.add('catSscroll');
                }
                else {
                    try {
                        document.getElementsByClassName('catS')[0].classList.remove('catSscroll');
                    }
                    catch (e) {

                    }
                }
            }
            else{//основной скроллинг

                var height = '';
                try{
                    height=parseFloat(getComputedStyle(document.getElementById('header')).height);
                }
                catch (e){
                    return;
                };
                var s=document.body.scrollTop;
                var viewportOffset = document.getElementById('PR').getBoundingClientRect();
                var top = viewportOffset.top;

                var pbb=PR.clientHeight;
                var y=this.scrollY;
                if (top <0) {
                    document.getElementsByClassName('topMenu')[0].classList.add('topMenuScroll');
                }
                else{
                    try {
                        document.getElementsByClassName('topMenu')[0].classList.remove('topMenuScroll');
                    }
                    catch (e){

                    }
                }



            }


        });

        /*Listening to the orientation change*/

        window.addEventListener("orientationchange", function() {
           checkOreintation();
        }, false);


    }
  //swipe
    function leftSwipe(event){
        SearchData(true,false,undefined,true);
    }
    function rightSwipe(event){
        SearchData(true,false,undefined,false);
    }


    function changeDisplay(param, elem, count, flag) {

        if(flag!=undefined){
            elem.style.display=param;
        }
        if(elem.classList.contains('curSubcat')&&param!='none')
            elem.style.display='block';
        let children=elem.childNodes;
        if(children.length!=0&&count>0){
            children.forEach((node)=>{
                if(node.classList.contains('categor-item')&&node.firstChild.dataset.info!='allProducts'){
                    node.style.display=param;
                    changeDisplay(param, node, count-1);
                }
            });
        }
    }

function curentSubcat(subcat){
        subcat.classList.add('curSubcat');
        subcat.style.display='block';//changing flex
        var children=subcat.childNodes;
        children[0].classList.add('curSubcatA');
        children[1].classList.add('curSubcatImg');


}

function getPointerFromHistoryCat(name) {
    var pointer={};
    historyCat.pointers.forEach((item,i)=> {
       if (item.name == name)
           pointer= {pointer: item.div, index: i} //item.div-указатель на div, к которому нужно перейти
   });
    return pointer;
}

    function onclick(e) {
        //working with subcats
        try{//Delete div(Перейти к категориям текущей категории)
            var goToPR=document.getElementsByClassName('ToProducts')[0];
            if(goToPR!=undefined&&!e.target.classList.contains('ToProducts')&&!e.target.classList.contains('subcatHistory')&&!e.target.classList.contains('categor'))
                goToPR.remove();
        }
        catch (err){

        }
        e.stopPropagation();
        var hasSubcats=false;
        if(e.target.nodeName=='DIV'&&e.target.firstChild.classList.contains('curSubcatA'))
            return
        if(e.target.nodeName=="IMG"||e.target.nodeName=="A"&& e.target.parentNode.getElementsByTagName('IMG').length>0){//Свернуть/развернуть категории


            var parent=e.target.parentNode;
            var histCat=parent;
            changeDisplay('none', parent.parentNode, 100);//Скрыть все категории
            changeDisplay('flex',parent,1, true);//Сделать видимыми нужные категории
            if(histCat.id!='categor')
                curentSubcat(parent);//Добавть класс для текущей категории
            renderHistoryCat(histCat);

            hasSubcats=true;
            if(e.target.nodeName=='IMG')
                searchDatabyCat(e.target.previousSibling, hasSubcats);

            var subh=document.getElementById('SUBH');
            if(subh.parentNode.id=='categor')//Для того, чтобы сделать видимым SUBH в мобильной версии
                subh.style.display='block'
        }
        var IMG=e.target.getElementsByTagName('IMG');
        if(e.target.classList.contains('categor-item')&&!e.target.classList.contains('subcatHistory')){


            if(IMG.length>0){
                changeDisplay('none', e.target.parentNode, 100);//Скрыть все категории
                changeDisplay('flex',e.target,1, true);//Сделать видимыми нужные категории
                if(e.target.id!='categor')
                    curentSubcat(e.target);//Добавть класс для текущей категории
                renderHistoryCat(e.target);
                document.getElementsByClassName('subcatHistory')[0].style.display='block';//changing flex to block
                hasSubcats=true;
            }
            var a=Array.from(e.target.getElementsByTagName('A'))[0];
            searchDatabyCat(a, hasSubcats);


            var subh=document.getElementById('SUBH');
            if(subh.parentNode.id=='categor')
                subh.style.display='block'
        }

        var p_target=e.target;
        if(e.target.nodeName=="A")
            p_target=e.target.parentNode;
        if(p_target.classList.contains('categor-item')&&p_target.children.length<2){
            if(!isInHistory(p_target.parentNode))
                 renderHistoryCat(p_target.parentNode);
            else {
                change2last();
            }
        }

        if(e.target.nodeName!='A')
            return;



        if(e.target.parentNode.classList.contains('subcatHistory')){
            rerenderCurentHistoryCat();
            var newVisibleCat=getPointerFromHistoryCat(e.target.dataset.info);
            if(newVisibleCat=={}) return;
            changeCurentCat(newVisibleCat);//Изменить текущую категорию и отрисовать это
            hasSubcats=true;
            var subh=document.getElementById('SUBH');
            if(e.target.dataset.info=='allProducts'&&subh.parentNode.id=='categor'){ //Для того, чтобы сделать невидимым SUBH в мобильной версии
                subh.style.display='none';
            }
        }

        searchDatabyCat(e.target, hasSubcats);
    }

    function changeCurentCat(newVisibleCat) {
        var count=0;
        for(let i=historyCat.pointers.length-1;i>newVisibleCat.index;i--){//Удалить лишние указатели из объекта historyCat
            if(historyCat.pointers[i].div!=null)
            {
                let ch=historyCat.pointers[i].div.childNodes;//Убрать классы "текущих" категорий
                historyCat.pointers[i].div.classList.remove('curSubcat');
                ch[0].classList.remove('curSubcatA');
                if(ch.length>1)
                    ch[1].classList.remove('curSubcatImg');
            }
            historyCat.pointers.pop();

            count++;
        }
        while (count>0){//Удалить лишние ссылки из объекта historyCat
            historyCat.div.lastChild.remove();
            count--;
            rerenderCurentHistoryCat();
        }
        if(historyCat.div.lastChild==null)
            historyCat.div=null;
        if(newVisibleCat.pointer==null){
            let categor=document.getElementById('categor');
            changeDisplay('none', categor, 100);//Скрыть все категории
            changeDisplay('flex',categor,1, true);//Сделать видимыми нужные категории
        }
        else{
            changeDisplay('none', newVisibleCat.pointer.parentNode, 100);//Скрыть все категории
            changeDisplay('flex',newVisibleCat.pointer,1, true);//Сделать видимыми нужные категории
        }
        categor.style.display='block';//changing flex to block
        document.getElementsByClassName('subcatHistory')[0].style.display='block';//changing flex to block

    }

    function searchDatabyCat(target, hasSubcats){

        var catNode=target;
       currentCat=catNode.cloneNode(true);
       changeActiveCat(target.parentNode, target);
       SearchData(false,true, hasSubcats);
       var isMobile=getComputedStyle(document.getElementsByClassName('mobile')[0]);
       var p_target=target;//Для того, чтобы скрывать категории в мобильной версии лишь тогда, когда нет подкатегорий
       if(target.nodeName=='A'||target.nodeName=='IMG')
           p_target=target.parentNode;
       if(isMobile.display!='none'&&!target.parentNode.classList.contains('subcatHistory')){
           if(p_target.children.length<2)
            hideCatsGoToProducts();
           else {
           addToProductsElementMenu();
           }
       }


    }

    function changeActiveCat(parrent, child) {


            if(activeCatPointer!=null)
            {
                try{
                    activeCatPointer.classList.remove('categor-item-active');
                }
                catch (e){

                }
            }
        if(!parrent.classList.contains('subcatHistory')){
            parrent.classList.add('categor-item-active');

            activeCatPointer=parrent;

        }
        else{
            var flag=false;
            if(child.nodeName=='A'&&child.dataset.info=='allProducts')
                flag=true;
            if(!flag)
              addToProductsElementMenu();
        }



    }

    function SearchDataPage(e) {
        if(e.target.nodeName=='A')
            SearchData(true,false);
    }

    function createElements(item, login, User, isOrdered) {
        var addSpan=false;
        var li=document.createElement('li') //0
        li.classList.add('product-wrapper');


        var a=document.createElement('a');//1
        a.classList.add('product');


        var divPrM=document.createElement('div');//2
        divPrM.classList.add('product-main');

        var divPrP=document.createElement('div');
        divPrP.classList.add('product-photo');//3

        var img=document.createElement('img');//4
        if(showPictures)
            img.setAttribute('src',item.icon);

        var divPrPr=document.createElement('div');//4
        //divPrPr.classList.add('product-preview');
        enableOrDisableHover(divPrPr);




            if(item.price!="0.00"){
                var span=document.createElement('span');//5
                span.classList.add('button');
                span.classList.add('to-cart');
                span.classList.add('first');
                span.setAttribute('data-info', item._id);
                span.textContent="В корзину";
                divPrPr.appendChild(span);

                var buttonP=document.createElement('button');
                buttonP.textContent='+';
                var buttonM=document.createElement('button');
                buttonM.textContent='-';

                var inputZakaz=document.createElement('input');
                inputZakaz.setAttribute('placeholder',`${item.minOrder} ${item.measure}`);
                inputZakaz.setAttribute('id',`inputZ${item._id}`);

                var zakazContainer=document.createElement('div');
                zakazContainer.classList.add('ZakazAmount');
                zakazContainer.classList.add('first');
                zakazContainer.appendChild(buttonM);
                zakazContainer.appendChild(inputZakaz);
                zakazContainer.appendChild(buttonP);
                divPrPr.appendChild(zakazContainer);

                //Events for buttons
                buttonM.addEventListener('click', decrementAmount.bind(item) );

                buttonP.addEventListener('click', incrementAmount.bind(item));


                inputZakaz.addEventListener('ch', changeZakaz.bind(item));

                inputZakaz.addEventListener('keyup', checkKey.bind(item));
                span.addEventListener('click', checkBeforeGoingToCart.bind(item));

                if(isAndroid){
                    buttonM.addEventListener('touchstart', decrementAmount.bind(item) );
                    buttonP.addEventListener('touchstart', incrementAmount.bind(item));

                    span.addEventListener('touchstart', checkBeforeGoingToCart.bind(item));

                }



            }




        var divPrT=document.createElement('div');//3
        divPrT.classList.add('product-text');

        var divPrN=document.createElement('div');//4
        divPrN.classList.add('product-name');

        var amount=document.createElement('small');
        amount.innerText=`На складе: ${item.amount}`;


        if(item.info!='null')
        {
            var productNAmeA=document.createElement('a');
            productNAmeA.setAttribute('href',item.info);
            productNAmeA.textContent=item.name;
            divPrN.appendChild(productNAmeA);
            productNAmeA.addEventListener('click',(e)=>{
                e.preventDefault();
                window.open(item.info, '_blank');
            });
        }
        else{//Вывод текстового описания
            divPrN.textContent=item.name;
            if(item.textDescription!=''){
                    var spanDescription=document.createElement('span');
                    spanDescription.classList.add('textDescription');
                    spanDescription.textContent=item.textDescription;

                    divPrP.appendChild(spanDescription);
                    img.style.opacity="0.3";



            }

        }


        var divPrDetailsWrap=document.createElement('div');//2
        divPrDetailsWrap.classList.add('product-details-wrap');

        var divPrDetails=document.createElement('div');//3
        divPrDetails.classList.add('product-details');

        var divPrAvail=document.createElement('div');//4
        divPrAvail.classList.add('product-availability');

        var spanIcon=document.createElement('span');//5
        spanIcon.classList.add('icon');
        spanIcon.classList.add('icon-check');


        var imgIcon=document.createElement('img');
       if(item.status[2]=='1'&&item.amount[0]=="0"){
           imgIcon.setAttribute('src','images/comingSoon.png');//Ожидается
           spanIcon.textContent='Ожидается';
       }
        else if(item.status[0]=='1'){
                imgIcon.setAttribute('src','images/New.png');//Новинка
                spanIcon.textContent='Новинка';
       }
       else if(item.status[1]=='1'){
           imgIcon.setAttribute('src','images/onSale.png');//Акция
           spanIcon.textContent='Акция';
       }
       else {
           if(item.amount!="0"){
               spanIcon.textContent='В наличии';
               imgIcon.setAttribute('src','images/inOrder.png');

           }
           else{
               spanIcon.textContent='Нет в наличии';
               imgIcon.setAttribute('src','images/no.jpg');
           }

       }

        imgIcon.classList.add('iconAvail');

        var spanPrPrice=document.createElement('span');//4
        spanPrPrice.classList.add('product-price');
        spanPrPrice.classList.add('fix');//Чтобы b, small=float:left только в корзине

        var spanPrPrice2=document.createElement('span');//4
        spanPrPrice2.classList.add('product-price');
        spanPrPrice2.classList.add('fix');//Чтобы b, small=float:left только в корзине

        if(login){

            userSettings.show=User.show;
            if(User.discount=='0.0'){
                userSettings.useDiscount=false;

            }
            else {
                userSettings.useDiscount=User.useDiscount;
                userSettings.discount=User.discount;
            }


            var small = document.createElement('small');//5

            if (item.status[2] != '1'||item.amount[0]!="0") {

                userSettings.curPrice[item._id]={};
                if (User.price.length == 0||User.show==false||User.curPrice=='0') {
                    var b = document.createElement('b');//5
                    b.textContent = item.price;

                    var small = document.createElement('small');//5
                    small.textContent = 'руб';
                    spanPrPrice.appendChild(b);
                    spanPrPrice.appendChild(small);

                    userSettings.curPrice[item._id].price=item.price;

                }
                else if(User.show==true) {
                    var b = document.createElement('b');//5
                    spanPrPrice.classList.add('crossedPrice');
                    b.textContent = item.price;

                    var small = document.createElement('small');//5
                    small.textContent = 'руб';
                    spanPrPrice.appendChild(b);
                    spanPrPrice.appendChild(small);


                    var b2 = document.createElement('b');//5
                    b2.textContent = item[`specialPrice${User.curPrice}`];

                    userSettings.curPrice[item._id].price=item[`specialPrice${User.curPrice}`];

                    var small2 = document.createElement('small');//5
                    small2.textContent = 'руб';
                    spanPrPrice2.appendChild(b2);
                    spanPrPrice2.appendChild(small2);

                    addSpan=true;

                }

            }
            else{
                var b = document.createElement('b');
                b.innerHTML='&nbsp';
                spanPrPrice.appendChild(b);
            }



        }
        else {
            userSettings.curPrice[item._id]={};
            userSettings.curPrice[item._id].price=item.price;
            var b=document.createElement('b');//5
            var small=document.createElement('small');//5
            if(item.status[2] != '1'||item.amount[0]!="0"){
                b.textContent=item.price;
                small.textContent='руб';
            }
            else {
                b.innerHTML='&nbsp';
                small.textContent=' ';
            }

            spanPrPrice.appendChild(b);
            spanPrPrice.appendChild(small);
        }

        if(isOrdered){
            zakazContainer.style.display='none';
            span.style.display='none';

            var div=document.createElement('div');
            div.classList.add('vKorzine');
            div.classList.add('second');
            div.textContent='В корзине';
            divPrPr.appendChild(div);
            divPrPr.style.opacity=1;
            divPrPr.style.bottom='11%';

            var aDelete=document.createElement('a');
            aDelete.classList.add('aDelFromKorzinaMain');
            aDelete.setAttribute('data-info',item._id);
            aDelete.classList.add('second');
            aDelete.setAttribute('href','#');
            aDelete.textContent='Удалить';
            aDelete.setAttribute('data-li',li);
            divPrPr.appendChild(aDelete);

            userSettings.curPrice[item._id].amount=getAmountFromCookies(item._id);




        }


        /*appending*/
        li.appendChild(a);
            a.appendChild(divPrM);
                divPrM.appendChild(divPrP);
                     divPrP.appendChild(img);
                    if(item.status!='Ожидается') {
                        divPrP.appendChild(divPrPr);

                    }
                divPrM.appendChild(divPrT);
                    divPrT.appendChild(divPrN);
                    divPrT.appendChild(amount);

            a.appendChild(divPrDetailsWrap);
                divPrDetailsWrap.appendChild(divPrDetails);
                    divPrDetails.appendChild(divPrAvail);
                        divPrAvail.appendChild(imgIcon);
                        divPrAvail.appendChild(spanIcon);
                        divPrDetails.appendChild(spanPrPrice);
                        if(addSpan)
                            divPrDetails.appendChild(spanPrPrice2);





        return li;
    }

    function openNewWindow(e) {

        if(e.target.nodeName=='A'&&e.target.href.includes('http')&&!e.target.href.includes('#'))
        {
            /*e.preventDefault();
            window.open(e.target.href, '_blank');*/
        }
        else if(e.target.classList.contains('button')&&e.target.classList.contains('to-cart')){//Добавление товара в корзину
            //alert('В данный момент на сайте ведутся технические работы. В скором времени корзина будет доступна. Приносим извинения за доставленные неудобства.');
            var amount=document.getElementById(`inputZ${e.target.dataset.info}`).value;
            if(amount=='')
                amount=document.getElementById(`inputZ${e.target.dataset.info}`).placeholder;
            var cookies=getCookie('orderId');
            try{
                amount=parseInt(amount);

                if(cookies==undefined||cookies=="")
                    setCookie('orderId',`${e.target.dataset.info}-${amount}`);
                else
                    setCookie('orderId',cookies+';'+`${e.target.dataset.info}-${amount}`);
            }
            catch (ev){
                if(cookies==undefined||cookies=="")
                    setCookie('orderId',`${e.target.dataset.info}-0`);
                else
                    setCookie('orderId',cookies+';'+`${e.target.dataset.info}-0`);
            }


            var li=e.target;
            while(li.nodeName!='LI')
                li=li.parentNode;
            addToCartList(li, e.target.dataset.info);

            changeShowingTotalPrice(setTotalPriceCookie(e.target, amount));
        }
        else if(e.target.classList.contains('textDescription')){
            if(e.target.style.overflow=="hidden"){
                e.target.style.overflow="visible";
            }
            else{
                e.target.style.overflow="hidden";
            }

        }
        else if(e.target.nodeName=='A'&&e.target.textContent=='Удалить'){
            deleteFromKorzina(e.target);
            changeShowingTotalPrice(deletePriceFromCookiePrice(e.target.dataset.info));
        }

    }
    
    function addToCartList(li, id) {//Добавление к товару класса, говорящего о том, что он находится в корзине
        var preview=li.getElementsByClassName('product-preview')[0]||li.getElementsByClassName('product-preview-mobile')[0];
        Show_Hide_prPreview(preview);
        var isSecond=Array.from(preview.getElementsByClassName('second')).length;
        if(isSecond>0)
            return
        var div=document.createElement('div');
        div.classList.add('vKorzine');
        div.classList.add('second');
        div.textContent='В корзине';
        preview.appendChild(div);
        preview.style.opacity=1;
        preview.style.bottom='11%';

        var aDelete=document.createElement('a');
        aDelete.classList.add('aDelFromKorzinaMain');
        aDelete.setAttribute('data-info',id);
        aDelete.classList.add('second');
        aDelete.setAttribute('href','#');
        aDelete.textContent='Удалить';
        aDelete.setAttribute('data-li',li);
        preview.appendChild(aDelete);

        userSettings.curPrice[id].amount=getAmountFromCookies(id);
        var a=userSettings.curPrice[id].amount;



    }

    function topMenuFetch(e) {//working with subcats
        if(e.target.classList.contains('subcatHistory')||e.target.parentNode.classList.contains('subcatHistory')){
            onclick(e);
            return

        }

        e.preventDefault();
        var reg=new RegExp('main');
        if(e.target.nodeName=='A'&&e.target.href.match(reg))
        {
            location.reload();
            return;
        }

        if(e.target.id=='mobMenu'){//показать категории
            var cat=document.getElementsByClassName('categor-wrapper-fix')[0];
            var ul=document.getElementById('PR');
            var pg=document.getElementById('light-pagination');
            var catInfo=getComputedStyle(cat);
            if(catInfo.display=="none"){

                $(cat).slideToggle(300);
               // document.body.classList.add('bodyScroll');
                ul.style.display="none";
                pg.style.display="none";


            }
            else {
                try{
                   // document.body.classList.remove('bodyScroll');
                }
                catch(err){

                }
                $(cat).slideToggle(300);
                ul.style.display="block";
                pg.style.display="block";

            }

        }
        else{//Переход в корзину
            if(!e.target.classList.contains('wrapImg')&&!e.target.parentNode.classList.contains('wrapImg'))
                return

            setStateCookie();

            if(e.target.classList.contains('wrapImg'))
                window.location=e.target.href;
            else if(e.target.parentNode.classList.contains('wrapImg'))
                window.location=e.target.parentNode.href;


        }



    }

    function setCookie(name, value, options) {//Установка кук
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }



    function changeSettings(e) {

        var a=e.target;
        if(a.nodeName=='A'&&a.textContent=='Настройки'){
            if(!wasTriggered){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/userSettings', true);
                xhr.send('');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState != 4) return;

                    if (xhr.status == 200) {
                        var USER=JSON.parse(xhr.response);

                        try{
                            var a=document.getElementById('check').textContent;
                        }
                        catch (e){
                            var divChange= document.getElementById('Change');
                            var loginForm=document.getElementById('loginForm');
                            var checkBox=document.createElement('input');
                            checkBox.setAttribute('type','checkbox');
                            checkBox.setAttribute('id','check');
                            if(!USER.show)
                                checkBox.setAttribute('checked', 'true');
                            var label=document.createElement('label');
                            label.setAttribute('for','check');
                            label.textContent='Скрыть Вашу цену';

                            var div=document.createElement('div');
                            div.style.display='inline';
                            div.appendChild(checkBox);
                            div.appendChild(label);

                            if(USER.discount!="0.0"){
                                var checkDiscount=document.createElement('input');
                                checkDiscount.setAttribute('type','checkbox');
                                checkDiscount.setAttribute('id','checkDiscount');

                                var labelDisc=document.createElement('label');
                                labelDisc.setAttribute('for','checkDiscount');
                                labelDisc.textContent=`Применить скидку в ${USER.discount}%`;

                                if(USER.useDiscount){
                                    checkDiscount.setAttribute('checked', 'true');
                                }

                                div.appendChild(checkDiscount);
                                div.appendChild(labelDisc);

                            }

                            var select=document.createElement('select');
                            select.setAttribute('id','selectPrice');
                            divChange.insertBefore(select, divChange.firstChild);
                            divChange.insertBefore(div,divChange.firstChild.nextSibling);
                            var opt=document.createElement('option');
                            opt.textContent='0';
                            select.appendChild(opt);
                            USER.price.forEach((item)=>{
                                var opt=document.createElement('option');
                                opt.textContent=`${item}`;
                                if(item==USER.curPrice){
                                    opt.setAttribute('selected', 'true');
                                }
                                select.appendChild(opt);
                            });
                        }
                        var divChange= document.getElementById('Change');
                        var loginForm=document.getElementById('loginForm');
                        $(loginForm).slideToggle(300);
                        $(divChange).slideToggle(300);
                        wasTriggered=true;



                    }
                }
            }
            else {
                var divChange= document.getElementById('Change');
                var loginForm=document.getElementById('loginForm');
                $(loginForm).slideToggle(300);
                $(divChange).slideToggle(300);


            }


        }
        else if(a.nodeName=='A'&&a.textContent=='Сохранить'){
         saveSettings(a);



        }

    }


    function changeZakaz(e) {

        var value=checkInput(e.target, this);
        if(value==null)
            return;

        if(value<this.minOrder&&value!=0&&value>0){
            //alert('Заказ должен быть кратен минимальной упаковке!');
            return;
        }
        else if(value<0)
            e.target.value=`${0} `;/*${this.measure}*/
        else
            e.target.value=`${value}`; /*${this.measure}*/


    }

    function incrementAmount (e) {
        e.preventDefault();
        let input=document.getElementById(`inputZ${this._id}`);
        if(input.value==''){
            input.value=this.minOrder*2;
            var event = new Event('ch');
            input.dispatchEvent(event);
            return
        }


        var value=checkInput(input,this);
        if(value==null)
            return;



        input.value=`${value+parseInt(this.minOrder)} ${this.measure}`;
        var event = new Event('ch');

        input.dispatchEvent(event);




    }

    function decrementAmount(e) {
        e.preventDefault();
        let input=document.getElementById(`inputZ${this._id}`);
        if(input.value==''){
            input.value=this.minOrder*2;

        }



        var value=checkInput(input,this);
        if(value==null)
            return;



        if(value>this.minOrder&&value-this.minOrder>0){
            input.value=`${value-this.minOrder} ${this.measure}`;
            var event = new Event('ch');
            input.dispatchEvent(event);
        }

        else{
            input.value=`0 ${this.measure}`;
            //alert(`Минимальный заказ для этого товара: ${this.minOrder}`);

        }



    }

    function checkKey(e) {
        var ip=document.getElementById(`inputZ${this._id}`);
        if(e.keyCode==8){


            return
        }
        else {
            /*setTimeout(()=>{
                var event = new Event('ch');
                ip.dispatchEvent(event);
            },3000);*/

        }

    }

    function checkBeforeGoingToCart() {
        //alert('1');
        var ip=document.getElementById(`inputZ${this._id}`);
        var event = new Event('ch');
        ip.dispatchEvent(event);

    }

    function checkInput(input, item) {
        var value=parseInt(input.value);
        if(!isInteger(input.value)){
            var addValue=input.value.split('').reverse().join('');
            try{
                var a=parseInt(addValue);
                if(!isNaN(a))
                  addValue=a;
                else
                    addValue='';
            }
            catch (err){
                addValue='';
            }
            if(addValue!='')
                value=value+''+addValue;
        }


        if(isNaN(value)){
            input.value=item.minOrder;
            //alert('Введите целое число');
            return null
        }
        return checkAmount(item, value);

    }

    function deleteFromKorzina(delHref){
        var id=delHref.dataset.info;
        var cookie=getCookie('orderId').split(';');
        var index=cookie.forEach((str,i)=>{
            if(str.includes(id)){
               cookie.splice(i,1);
               return
            }
        });



        setCookie('orderId', cookie.join(';'));

        Show_Hide_prPreview(delHref.parentNode);




    }

    function Show_Hide_prPreview(preview) {

        var elementsFirst=Array.from(preview.getElementsByClassName('first'));
        var elementsSecond=Array.from(preview.getElementsByClassName('second'));


        elementsFirst.forEach((elem)=>{
            $(elem).slideToggle(300);


        });

        elementsSecond.forEach((elem)=>{
            $(elem).slideToggle(300);

        });
        if(elementsSecond.length==0)
            return
        var styleSecond=getComputedStyle(elementsSecond[0]);
        if(styleSecond.display!='none')
            preview.style.opacity='0';
        else
            preview.style.opacity='1';

    }
    
    function setTotalPriceCookie(a, amount) {
        var id=a.dataset.info;
        userSettings.curPrice[id].amount=amount;


        var cookiePrice=getCookie('Price');
        var priceForItem=getPriceForItemMultAmount(id);
        try{
            var priceInCookies=parseFloat(cookiePrice)+priceForItem;
            if(priceInCookies==''||isNaN(priceInCookies))
                throw Error;
        }
        catch (err){
            var priceInCookies=priceForItem;
        }

        setCookie('Price',priceInCookies);

        return priceInCookies;


    }

    function getPriceForItemMultAmount(id) {
        var amount=userSettings.curPrice[id].amount;
        if(amount==''||amount==undefined)
            amount=0;
        else
            try {
                amount=parseInt(amount);

            }
            catch(err){
            amount=0;
            }

        var discount=0;
        if(userSettings.useDiscount)
            discount=parseFloat(userSettings.discount);

        var price=userSettings.curPrice[id].price;

        var priceForItem=Math.round((amount*price-amount*price*discount/100)*1000)/1000;

        return priceForItem;

    }

    function deletePriceFromCookiePrice(id){
        var cookiePrice=getCookie('Price');

        var priceForItem=getPriceForItemMultAmount(id);
        try{
            var priceInCookies=parseFloat(cookiePrice)-priceForItem;
            if(priceInCookies==''||isNaN(priceInCookies))
                throw Error;
        }
        catch (err){
            var priceInCookies='';
        }

        if(priceInCookies<0)
            priceInCookies='';

        setCookie('Price',priceInCookies);

        return priceInCookies;

    }

    function changeShowingTotalPrice(price) {
        var totalPriceCart=document.getElementById(`PriceTotalInCart`);

        var corzina=document.getElementsByClassName('corzina')[0];

        corzina.style.opacity=0.2;

        document.getElementsByClassName('wrapImg')[0].style.width='auto';
        if(totalPriceCart==undefined){
            var totalPriceCart=document.createElement('span');
            totalPriceCart.setAttribute('id','PriceTotalInCart');
            document.getElementsByClassName('wrapImg')[0].appendChild(totalPriceCart);
            totalPriceCart.style.display='inline';

        }
        totalPriceCart.style.display='inline';

        if(price==''){
            var corzina=document.getElementsByClassName('corzina')[0];

            corzina.style.opacity=1;
            totalPriceCart.style.display='none';
            document.getElementsByClassName('wrapImg')[0].style.width='';

        }
        price=Math.round(price * 1000) / 1000;
        totalPriceCart.textContent=price;
        changeFontSizeDependOnLength(totalPriceCart);
    }

    function setShowingTotalPrice() {
        var cookiePrice=getCookie('Price');
        try{
            var priceInCookies=parseFloat(cookiePrice);
            if(priceInCookies==''||isNaN(priceInCookies))
                throw Error;
        }
        catch (err){
            var priceInCookies='';
        }
        changeShowingTotalPrice(priceInCookies);
    }

    function getAmountFromCookies(id) {
        var cookies=Array.from(getCookie('orderId').split(';'));
        var amount=0;
        cookies.forEach((item)=>{
            if(item.includes(id))
                amount=item.split('-')[1]
        });
        return amount;
    }

    function clearAllCookies() {
        setCookie('Price','');
        setCookie('orderId','');
    }

    function setStateCookie() {
        var PageS;
        var categor;
        if(currentCat==null)
            categor=null;
        else
            categor=currentCat.getAttribute('data-info');
        if(document.getElementById('light-pagination').firstChild!=undefined)
            PageS=$('#light-pagination').pagination('getCurrentPage');
        else
            PageS=1;
        var hSubc=false;
        var cat=document.getElementsByClassName('categor-item categor-item-active')[0];
        if(currentCat!=null&&cat!=undefined&&cat.children.length>1)
            hSubc=true;
        var StateCookie={
            sort:document.getElementById('chooseSort').options[document.getElementById('chooseSort').selectedIndex].value,
            searchText:document.getElementById('dataSearch').searchD.value,
            page:PageS,
            categor:categor,
            hasSubcats:hSubc,
            history:setHistory(),
            showIM:showPictures
        }


      if(StateCookie.page==1&&StateCookie.searchText==''&&StateCookie.sort=='0'&&StateCookie.categor==null&&StateCookie.history==false&&showPictures==true)
          return
      var cookie=serialize(StateCookie);
      setCookie('state', cookie);
    }


    function serialize(obj) {
        var str='';
        for(var key in obj){
            str+=';'+obj[key]
        }
        return str.substring(1)

    }

    function deserialize(str) {
        var obj={};
        str.split(';').forEach((item, i)=>{
            switch(i){
                case 0:
                    obj.sort=item;
                    break;
                case 1:
                    obj.searchText=item;
                    break;
                case 2:
                    obj.page=item;
                    break;
                case 3:
                    obj.categor=item;
                    break;
                case 4:
                    obj.hasSubcats=item;
                    break
                case 5:
                    obj.history=item
                    break
                case 6:
                    obj.showIm=item;
            }
        });

        return obj
    }

    function getStateCookie() {
        var cookie=getCookie('state')
        if(cookie==undefined||cookie=='')
            return false
        var obj=deserialize(cookie);
        if(isEmpty(obj))
            return false
        return obj
    }

    function isEmpty(obj) {
        var count=0;
        var length=0;
        for(var key in obj){
            if(obj[key]=='0')
                count++
            length++;
        }

        if(count==length)
            return true

        return false
    }

    function switchCurentCat(cat) {


        var children=Array.from(cat.children);
        cat.classList.add('categor-item-active');
        if(children.length>2){
            cat.style.display='block';
            cat.classList.add('curSubcat');


            Array.from(cat.children).forEach((ch)=>{
                if(ch.nodeName=='A')
                    ch.classList.add('curSubcatA');
                if(ch.nodeName=='IMG')
                    ch.classList.add('curSubcatImg');
            });
            children.forEach((ch)=>{
                if(ch.nodeName!='A'&&ch.nodeName!='IMG')
                    ch.style.display='flex';
            });

            var newName='';
            Array.from(cat.children).forEach((ch)=>{
                if(ch.nodeName=='A'){
                    newName=ch.textContent;
                    return
                }
            });
            changeInLoop(cat.parentNode, newName)
        }
        else{
            Array.from(cat.parentNode.children).forEach((ch)=>{
                if(ch.nodeName!='A'&&ch.nodeName!='IMG')
                    ch.style.display='flex';
            });
            cat.parentNode.classList.add('curSubcat')
            cat.parentNode.style.display='block';

                Array.from(cat.parentNode.children).forEach((ch)=>{
                    if(ch.nodeName=='A')
                       ch.classList.add('curSubcatA');
                    if(ch.nodeName=='IMG')
                        ch.classList.add('curSubcatImg');
                });
            var newName='';
            Array.from(cat.parentNode.children).forEach((ch)=>{
                if(ch.nodeName=='A'){
                    newName=ch.textContent;
                    return
                }
            });
            changeInLoop(cat.parentNode.parentNode, newName)
        }
        
      



    }

    function changeInLoop(parent, nameN) {
        var name=nameN;
        if(parent.id=='categor'){

            Array.from(parent.children).forEach((ch)=>{
                if(ch.nodeName=='A')
                    ch.classList.add('curSubcatA');
                if(ch.nodeName=='IMG')
                    ch.classList.add('curSubcatImg');
            });
            Array.from(parent.children).forEach((ch)=>{
                if(!compareAname(ch, name)&&!isCurentSubcat(ch)&&!isSubhistory(ch))
                    ch.style.display='none';
            });


        }

        do
        {
            parent.classList.add('curSubcat')
            parent.style.display='block';
            Array.from(parent.children).forEach((ch)=>{
                if(ch.nodeName=='A')
                    ch.classList.add('curSubcatA');
                if(ch.nodeName=='IMG')
                    ch.classList.add('curSubcatImg');
            });
            Array.from(parent.children).forEach((ch)=>{
                if(!compareAname(ch, name)&&!isCurentSubcat(ch)&&!isSubhistory(ch))
                    ch.style.display='none';
            });

                var newName='';
            Array.from(parent.children).forEach((ch)=>{
                if(ch.nodeName=='A'){
                    newName=ch.textContent;
                    return
                }
            });
            parent=parent.parentNode;

            name=newName;
        }
        while(parent.id!='categor-wrapper')



    }

    function compareAname(cat, name) {
        var flag=false;
        Array.from(cat.children).forEach((item)=>{
            if(item.nodeName=='A'&&item.textContent==name){
                flag=true;
                return
            }
        });

        return flag
    }

    function isSubhistory(ch) {
        if(ch.classList.contains('subcatHistory'))
            return true

        return false
    }

    function isCurentSubcat(children){
        if(children.classList.contains('curSubcatA')||children.classList.contains('curSubcatImg'))
            return true

        return false
    }

    function rerenderCurentHistoryCat() {
        var histCat=document.getElementById('SUBH');
        var children= Array.from(histCat.children);
       children.forEach((a,i)=>{
            if(i==children.length-2)
                a.style.display='inline'
           else {
                a.style.display='none';
            }

        });
    }

    function setHistory(){
        var str='|';
        var subH=document.getElementById('SUBH');

        var children=Array.from(subH.children);
        children.forEach((a,i)=>{
            str+=a.dataset.info+'-'+a.style.display+'|';
        });
        if(str=='|')
            return false
        return str.substring(1);
    }

    function getHistorySetHistory(history) {
        if(history=="false")
            return
        var subcatH=document.getElementById('SUBH');
        historyCat.div=subcatH;
        var mass=history.split('|');
        mass.pop();
        mass.forEach((str)=>{
            var jer=str.split('-');
            var a=document.createElement('A');
            a.setAttribute('data-info',jer[0]);
            a.setAttribute('href','#');
            a.style.display=jer[1];
            if(jer[0]=='allProducts')
                a.textContent='Все товары';
            else
                a.textContent='Назад';
            subcatH.appendChild(a);
            historyCat.pointers.push(
                {
                    name:jer[0],
                    div:findElementByDataInfo(jer[0])
                }
            )

        });
        var active=document.getElementsByClassName('categor-item-active')[0];
        activeCatPointer=active;
        currentCat=active.firstChild;
        var subh=document.getElementById('SUBH');
        if(subh.parentNode.id=='categor')
            subh.style.display='block'
    }

    function findElementByDataInfo(info) {
        if(info=='allProducts')
            return null
        var cat=document.getElementById('categor');
        var massA=Array.from(cat.querySelectorAll(`[data-info='${info}']`));
        for(let i=0;i<massA.length;i++){
            if(!massA[i].parentNode.classList.contains('subcatHistory'))
                return massA[i].parentNode;
        }


    }

    function addSubhistory() {

        var topMenu=document.getElementsByClassName('topMenu')[0];
        var categor=document.getElementById('categor');

          if(document.getElementById('SUBH')==undefined){
              var div_2=document.createElement('div');
              div_2.classList.add('subcatHistory');
              div_2.setAttribute('id','SUBH');
              if(isMobileVersion){

                  categor.insertBefore(div_2,categor.firstChild);

              }
              else
                  topMenu.insertBefore(div_2, topMenu.firstChild);
          }


    }

    function chechForMobile() {
        const mq = window.matchMedia( "(min-width: 801px)" );
        if (mq.matches) {
            isMobileVersion=false;
        } else {
            isMobileVersion=true;
        }
        var a=0;
    }

    function isFAndroid() {
        return navigator.userAgent.match(/Android/i);
    }

    function checkForBigScreen(){
        return window.matchMedia( "(min-width: 600px)" ).matches
    }

    function checkMobile(){
        return !window.matchMedia( "(min-width: 801px)" ).matches
    }
    function isInHistory(div) {
        var info=div.firstChild.dataset.info;
        var history=Array.from(document.getElementById('SUBH').children);
        for(let i=0;i<history.length;i++){
            if(history[i].dataset.info==info)
                return true
        }

        return false

    }

    function change2last() {
        var histCat=Array.from(document.getElementById('SUBH').children);
        histCat[histCat.length-2].style.display='none';
        histCat[histCat.length-1].style.display='inline';

    }

    function insertCheckbox() {
        var check=document.createElement('input');
        check.setAttribute('id','showPtotos');
        check.setAttribute('type','checkbox');

        var dataS=document.getElementsByClassName('topMenu')[0];
        dataS.insertBefore(check,dataS.firstChild);
    }
    function setImgShowOrNot() {
        var photo=document.getElementById('ShowImg');
        if(showPictures)
            photo.setAttribute('src','images/showImg.png');
        else
            photo.setAttribute('src','images/hideImg.png');



    }

    function isInteger(x) {
        return x % 1 === 0;
    }

    function changeFontSizeDependOnLength(PriceTotalInCart) {
        if(PriceTotalInCart==undefined||PriceTotalInCart.style.display=='none')
            return
        var count=PriceTotalInCart.textContent.length;
        PriceTotalInCart.style.right='5px';
        if(count<4){
            PriceTotalInCart.style.right='-2px';
        }
        else if(count<6)
            PriceTotalInCart.style.fontSize='1.1em'
        else if(count<8)
            PriceTotalInCart.style.fontSize='0.9em'
        else {
            PriceTotalInCart.style.fontSize='0.7em'
        }
    }

    function hideCatsGoToProducts() {
        var cat=document.getElementsByClassName('categor-wrapper-fix')[0];
        var ul=document.getElementById('PR');
        var pg=document.getElementById('light-pagination');
        cat.style.display="none";
        ul.style.display="block";
        pg.style.display="block";

    }

    function setWaitingIndecator() {
        var ul=document.getElementById('PR');
        var li=document.getElementById('waitForLoading');
        if(li==undefined)
            return
        li.textContent='Подождите, наш каталог обновляется. Это может занять несколько минут';

    }
    function addToProductsElementMenu() {
        if(!isMobileVersion)
            return
        var subh=document.getElementById('SUBH');
        var categor=document.getElementById('categor');
        var div=document.createElement('div');
        categor.insertBefore(div,subh.nextSibling);
        div.classList.add('ToProducts');
        div.textContent='Перейти к товарам этой категроии';
        div.addEventListener('click',(e)=>{
            hideCatsGoToProducts();
        })
    }

    function checkForEnableScrolling(element) {
        if(!isMobileVersion)
            return true

        var flag=false;
        var cat=document.getElementsByClassName('categor-wrapper-fix')[0];
        var catStyle=getComputedStyle(cat);

        if(catStyle.display!='none'){
            var c=document.getElementById('categor');
            if(isDescendant(c, element))
                return true
            else
                return false
        }


        while(element.nodeName!="HTML"&&flag==false){
            if(element.id=="PR")
                flag=true

            element=element.parentNode;
        }
        return flag
    }

    function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    function checkAmount(item, value){
        var ost=value % item.minOrder;
        if(ost ==0)
            return value;
        else
            return value-ost-(-item.minOrder)
    }

    function saveSettings(a) {
        var form=document.getElementById('Change');
        var selectedPrice=document.getElementById('selectPrice').options[document.getElementById('selectPrice').selectedIndex].value;
        var check1=document.getElementById('check').checked;
        var check2=false;
        try {
            check2=document.getElementById('checkDiscount').checked;
        }
        catch (err){

        }
        var req={
            curPrice:selectedPrice,
            showSP_Price:!check1,
            useDiscount:check2
        };




        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/userSettings', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(req));
        a.textContent='Сохранение...'
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                var divChange= document.getElementById('Change');
                var loginForm=document.getElementById('loginForm');
                $(loginForm).slideToggle(300);
                $(divChange).slideToggle(300);
                a.textContent='Сохранить';
                let obj=JSON.parse(xhr.response);
                if(obj.goToCart)
                    location.assign('/corzina');
                else if(obj.done){
                    SearchData(false, true);
                }



            }
            else{
                /*console.log('saving error');
                var divChange= document.getElementById('Change');
                var loginForm=document.getElementById('loginForm');
                $(loginForm).slideToggle(300);
                $(divChange).slideToggle(300);
                a.textContent='Сохранить';*/
            }


        }
    }

    function checkOreintation() {
        var isNewOrientationMobile=checkMobile();
        if((window.orientation==90||window.orientation==-90||window.orientation==0)&&(isMobileVersion!=isNewOrientationMobile))
            location.reload();
        chechForMobile();
    }

    function setSwipeHold() {
        var hold=0;
        if(isFAndroid()){
            hold=50;
        }
        if(checkForBigScreen()){
            $("#PR").swipe( {
                swipeLeft:leftSwipe,
                swipeRight:rightSwipe,
                threshold:225
            });
        }
        else {
            $("#PR").swipe( {
                swipeLeft:leftSwipe,
                swipeRight:rightSwipe,
                threshold:hold
            });
        }
    }
    
    function enableOrDisableHover(divPrPr) {
        if(!isMobileVersion){
            divPrPr.classList.add('product-preview');

        }
        else {
            divPrPr.classList.add('product-preview-mobile');
            if(isAndroid)
                divPrPr.addEventListener('touchstart',toggleButtonToCart.bind(divPrPr));
            else
                divPrPr.addEventListener('click', toggleButtonToCart.bind(divPrPr));
        }

    }

    function toggleButtonToCart(e) {
        if(this.style.opacity==0){
            this.style.opacity=1;
            e.stopPropagation();

        }
        else if(e.target.classList.contains('product-preview-mobile')){
            this.style.opacity=0

        }



    }






});


