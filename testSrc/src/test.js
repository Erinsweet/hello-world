dialog.open({
    width : null,
    height : null,
    content : "<com></com>",
    data : {

        update(){

        }
    },
    components : {
        com
    },
    btns : [
        {
            value : "取消",
            action(obj){
                obj.close();
            }
        }
    ]
});