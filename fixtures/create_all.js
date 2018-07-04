const Dataq=require('../models/data');
const fs = require('fs');
var mainFile;
var clearAll=require('./clear_all');
var resultCat=[];
var resultMass = [];
var resultUsers=[];
async function main(resolve) {

    mainFile=await JSON.parse(fs.readFileSync('./Price/last.json', 'utf8'));
    //mainFile=require('../Price/last.json');
    var changeUsers=false;
    var changeData=false;
    var changeCats=false;

   /*if(mainFile.users!=undefined)
       changeUsers=true;*/

   if(mainFile.groups!=undefined)
       changeCats=true;

    if(mainFile.data!=undefined)
        changeData=true;

    console.log('start del');
    await clearAll(changeUsers,changeCats,changeData);
    console.log('end del');
 //addUsers

 await addUsers();

//add categories
await addCats(changeCats);

//parcing data from JSON
await addData(changeData)
    .then(()=>{
      deleteAfter();
    });

}

function takeName(str) {
    if(str.indexOf('<')==-1)
        return str
    return str.substring(0,str.indexOf('<'));


}

function takeStatus(str) {
    if(str.indexOf('<')==-1)
        return 'В наличие'
    return str.substring(str.indexOf('<strong>')+8,str.indexOf('</strong>'));
}

function takeInfo(str1, str2) {
    if(str1==''||str1==undefined){
     if(str2==''||str2==undefined)
         return 'null'
     else
         return str2
    }


    return mainFile.prefixes[0]+str1


}

function takeIcon(str) {
    if(str==''||str==undefined)
        return 'images/noPicture.png'
    return mainFile.prefixes[1]+str
}

function takeAmount(str) {
    return str.substring(str.indexOf('+'))
}

function takeCat(str) {
    if(str==undefined)
        return 'null'
    return str
}

async function sortPriceUp() {
        //var sortedMass = mass;
        await resultMass.sort((a, b) => {
            return a.price - b.price;
        });

        for(let i=0;i<resultMass.length;i++){
            resultMass[i].indexSortUp=i;
        }

        /*await resultMass.forEach(function (item,i) {

        });
*/



    }

async function sortAlpha() {
   /* var sortedMass = mass.slice(); //mass.slice();*/
    var itogMass=[];

    for(let i=0;i<resultMass.length;i++){
        itogMass[i]=[prepareForSprtAlpha(resultMass[i].name),i];
    }

    /*resultMass.forEach(function (item,i) {
        itogMass[i]=[prepareForSprtAlpha(item.name),i];
    });*/

    itogMass.sort();
    itogMass.forEach((item,i)=>{
        resultMass[item[1]].indexSortAlp=i;
    });
    itogMass=[];


}

function FindId(id, mass) {
        var i=mass.length-1;
        var f=false;
        while(f==false&&i>0){
            if(mass[i]._id==id)
                f=true;
            i--;
        }
        return i+1;
    }
 function firstLetter(string) {
    for(var i=0; i<string.length;i++){
        var lll=string[i];
        var p=string[i].toUpperCase().charCodeAt(0);
       if(p>1039&&p<1072||p>64&&p<91){
           return i
       }
    }
}

function compareLetters(a,b, i) {


    if(a[i]!=b[i]&&i<a.length&&i<b.length)
        return a[i].charCodeAt(0)-b[i].charCodeAt(0)
    else {
        if(a.length==b.length&&a.length==i)
            return 1
        if(a.length>b.length && i==b.length)
            return -1
        if(b.length>a.length && i==a.length)
            return 1

        compareLetters(a,b,i+1);
    }
}

async function addUsers() {


    const User=require('../models/user');
    const session=require('../models/session');


        console.log('start adding users');
        var USERS=mainFile.users;
        if(USERS==undefined){
            USERS=[];
        }

        for(let i=0;i<USERS.length;i++){
            User.find({"_id":USERS[i][0]})
                .then((userDB)=>{
                    if(userDB[0]==undefined&&USERS[i][1]!='null'){
                        let prices=USERS[i][4].split(' ');
                        let user={
                            _id:USERS[i][0],
                            username:USERS[i][1],
                            displayName:USERS[i][3],
                            password:USERS[i][2],
                            visiblePrice:prices,
                            discount:USERS[i][5],
                            curPrice:prices[prices.length-1],
                            showSP_Price:false,
                            useDiscount:true,
                            email:USERS[i][6]||'',
                            phone:USERS[i][7]
                        };
                        let us=new User(user);
                        try{
                             us.save();
                            console.log(`user ${USERS[i][1]} is added to the database`);
                        }
                        catch (err){
                            console.log(`user ${USERS[i][1]} error adding to the database: ${err}`);
                        }

                    }
                    else{
                         User.remove({"_id":USERS[i][0]})
                             .then(()=>{
                                 console.log(`user ${USERS[i][1]} is removed from the database`);
                                 if(USERS[i][1]=='null'){
                                     try{

                                         session.remove({"user":USERS[i][0]})
                                             .then((res)=>{
                                                 console.log(`session for ${USERS[i][1]} is deleted`);
                                             })
                                             .catch((err)=>{
                                                 console.log(`session ${USERS[i][0]} deleting error: ${err}`);
                                             })

                                     }
                                     catch (err){
                                         console.log(`session ${USERS[i][0]} deleting error!`);
                                     }

                                 }
                                 else{
                                     let prices=USERS[i][4].split(' ');
                                     let user={
                                         _id:USERS[i][0],
                                         username:USERS[i][1],
                                         displayName:USERS[i][3],
                                         password:USERS[i][2],
                                         visiblePrice:prices,
                                         discount:USERS[i][5],
                                         curPrice:prices[prices.length-1],
                                         showSP_Price:false,
                                         useDiscount:true,
                                         email:USERS[i][6]||'',
                                         phone:USERS[i][7]
                                     };
                                     let us=new User(user);
                                     try{
                                         us.save();
                                         console.log(`user ${USERS[i][1]} is updated`);
                                     }
                                     catch (err){
                                         console.log(`user ${USERS[i][1]} updating error: ${err}`);
                                     }


                                 }





                             })
                             .catch((err)=>{
                             console.log(`error deleting user: ${err}`);
                             })


                    }

                });

        }





}

async function addCats(isNeeded) {
    if(!isNeeded)
        return

    const Categor=require('../models/categor');
    try{
        console.log('start adding cats');
        mainFile.groups.forEach((item, i)=>{
            let cat={
                name:item.name,
                subcat:item.subcat,
                index:i
            };
            resultCat.push(cat);

        });
    }
    catch (e) {
        console.log('adding cats error!');
    }
    console.log(`resultCatLegth: ${resultMass.length}`);

    for(let i=0;i<resultCat.length;i++){
        let cat=new Categor(resultCat[i]);
        await cat.save();
        console.log(`category ${resultCat[i].name} is added to the database`);
    }

    /*resultCat.forEach(async function (item) {
        let cat=new Categor(item);
        await cat.save();
        console.log(`category ${item.name} is added to the database`);
    });*/


}

async function addData(isNeeded) {
    if(!isNeeded)
        return


    try {
        console.log('start adding products');
        mainFile.data.forEach((item, i) => {
            var dataObj = {
                _id: parseInt(item[0]),
                name: item[0] + ' ' + item[1],
                status: item[2],
                textDescription: item[3],
                measure: item[4],
                amount: item[5],
                price: item[6],
                specialPrice1: item[7],
                specialPrice2: item[8],
                specialPrice3: item[9],
                specialPrice4: item[10],
                minOrder: item[11],
                category: takeCat(item[12]),
                icon: takeIcon(item[13]),
                info: takeInfo(item[13], item[14]),
                index: i,


            };
            resultMass.push(dataObj);
        });

    }
    catch (e) {
        console.log('err: ', e)
    }

    await sortPriceUp();
    await sortAlpha();
    var a=0;

    console.log(`resultDataLength ${resultMass.length}`);

    try{

        for(let i=0;i<resultMass.length;i++){
            var b=new Dataq(resultMass[i]);
            await b.save();
            console.log(`item added: ${i}`);
        }

    }
    catch (err){
        console.log(`data error: ${err}`);

    }


}

 function sort(mass) {
    var resMass=mass;
    var flag=true;
    while(flag){
        flag=false;
        resMass.forEach((item,i)=>{

            if(i<resMass.length-1){
                var aN=item.name.substring(firstLetter(item.name)).toUpperCase();
                var bN=resMass[i+1].name.substring(firstLetter(resMass[i+1].name)).toUpperCase();

                var index=compareLetters(aN,bN,0);
                if(index>0){
                    let b=resMass[i+1];
                    resMass[i+1]=item;
                    resMass[i]=b;
                    flag=true;
                }

            }

        })

    }
    return resMass

}

function prepareForSprtAlpha(str) {
    var index=firstLetter(str);
    var str_1=str.substring(index).toUpperCase();
    var itog='';
    for(let i=0;i<str_1.length;i++){
        var p=str_1[i].charCodeAt(0);
        if(p>64&&p<91||p>1038&&p<1073)
            itog+=str_1[i];
    }
    return itog;
}

function deleteAfter() {
    resultCat=[];
    resultMass=[];
    resultUsers=[];
    console.log(`cat length: ${resultCat.length}, product length: ${resultMass.length}, users length: ${resultUsers.length}`);

    /*try{
        //session.connection.close();
        console.log('Data connection closed');
    }
    catch(err){
        console.log('Data connection closed error');
    }*/


}




module.exports=main;
