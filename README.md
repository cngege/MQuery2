# 欢迎使用 Mquery2 JS前置库
**MinecraftPE BDS ```NETJSRunner``` -> JS前置库**

## 这是什么?
- *MQuery2 是 继 MQuery之后的新的 JS前置库 虽然是JaveScript语言的库，但并不是用于Html上，而是为Minecraft基岩版服务端的模组服务。*
- *如果你知道JQuery ,那你应该就能理解这个前置，将模组为你提供的API重新整理，使得更加通俗易用，目前该项目随NETJSRunner更新而更新*

### 我该怎么去使用这个库?
- *首先去了解这个库的API，目前并没有单独的去制作API文档,但库文件中有对每一个（大多数）的API的详细注释。想JQuery那样去调用它们*
- *了解了API之后 搭建你的MC服务端、梦故Dll加载器, NetRunner , NetJSRuner 都部署完成之后,将此库文件(.MQuery.js)放入你服务器的JS加载文件夹内,然后新建你自己的js mod，在开头加入 ``` let $ = getShareData("_Mquery"); ```, 在后面完成你的脚本，尽量不要修改本库的文件名*


### 示例：
```JaveScript
let $ = getShareData("_Mquery");
if ($ == null) {
    throw new Error("没有载入Mquery前置,请下载")
}

// 匿名方式设置攻击事件前监听器【禁止攻击村民】
$('#onAttack').BListener('add', function (e){
	var je = $.json(e);
	if(je.actortype == "entity.villager_v2.name"){
		$.say(`玩家\"${je.playername}\"在尝试攻击村民`);
		return false;
	}
});

```

## License

MIT