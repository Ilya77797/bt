
var path='';
var TIMER=null;
var fs;
var md5File;
var Info;
var  createAll;
function watch(pathToFile ,fs_1, md5File_1, Info_1, createAll_1) {
     fs=fs_1;
     md5File=md5File_1;
     Info=Info_1;
     createAll=createAll_1;
     fs.watchFile(pathToFile, async function (event, filename) {
        console.log('event is: ' + event);
        path=pathToFile;

        if(!fs.existsSync(pathToFile)){

         /*  TIMER=setInterval(()=>{
               if(fs.existsSync(path)){
                   clearInterval(TIMER);
                   promiseChanged();
               }
           },2000);*/


        }
        else{
            promiseChanged();
        }



    });
}

function isChanged(pathToFile) {
    return new Promise((resolve, reject)=>{


        md5File(pathToFile, async function(err, hash){
            if (err) throw err
            console.log(`The MD5 sum of LICENSE.md is: ${hash}`);
            if(await isEqual(hash))
                resolve(false);
            else {
                await saveHash(hash);

                resolve(true);
            }



        });
    });

}

async function isEqual(hash) {
    var info=await Info.find({_id:0});
    var oldHash=info[0].fileHash;
    if(hash==oldHash)
        return true
    return false
}

async function saveHash(hash) {
    var DATE=Date.now();//new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`DATE: ${DATE}`);
    await Info.update({ _id: 0 }, { $set: { fileHash: hash }});
    await Info.update({ _id: 0 }, { $set: { time: DATE }});
}

function promiseChanged() {
    isChanged(path)
        .then((isCh)=>{
            if(isCh){
                console.log('start updating...');
                try{
                    createAll();
                }
                catch(err){
                    console.log(`updating error: ${err}`);
                }


            }
            else{
                console.log('no update');
            }

        })
        .catch(()=>{
        console.log('error');
        });

}

module.exports=watch;

