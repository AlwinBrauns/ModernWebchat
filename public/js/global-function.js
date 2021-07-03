function getChildByName(parent, name){
    let child = undefined;
    for (var index = 0; index < parent.children.length; index++){
        if(parent.children[index].attributes?.name?.value == name){
            child = parent.children[index];
            return child;
        }else{
            child = getChildByName(parent.children[index], name);
            if(child!=undefined){
                return child;
            }
        }
    }
    return undefined;
}