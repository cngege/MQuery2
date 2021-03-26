//let $ = getShareData("_Mquery");
//CSR_NETJS
//by：CNGEGE

let formdata = {};																//表单事件存储
let playerlist = [];
let _$ = (a,b)=>{return new Mquery(a,b)};

setShareData("_Mquery",_$);

let Mquery = function (a,b){
	let data = [];	//0:name 1:uuid
	let type = "";	//player or event
	if(typeof a == "string"){
		if(a.substring(0,1) == "#"){											//参数字符串以 # 开头
			data[0] = a.replace("#","");
			type = "event";
			this.key = data[0];
		}else{																	//否则参数代表的是玩家名称或UUID
			if(_$.isuuid(a)){
				data[0] = _$.json(selectPlayer(a)).playername;
				data[1] = a;
			}else{
				data[0] = a;
				data[1] = _$.nametouuid(a);
			}
			type = "player";
			this.playername = data[0];
			this.uuid = data[1];
		}
	}else{throw new Error("MQuert参数不能接受非法值")}
	this.type = type;
	
	
	
	this.BListener = (type,fun)=>{													//注册、移除事件前监听器 type:add/remove
		if(type == "add"){
			addBeforeActListener(data[0],fun);
		}else if(type == "remove"){
			return removeBeforeActListener(data[0],fun);
		}
	}
	this.AListener = (type,fun)=>{													//注册、移除事件后监听器 type:add/remove
		if(type == "add"){
			addAfterActListener(data[0],fun);
		}else if(type == "remove"){
			return removeAfterActListener(data[0],fun);
		}
	}
	this.reName = (newname)=>reNameByUuid(data[1],newname);						//重命名服务器玩家的名字
	this.getPAB = ()=>{															//读取玩家能力表
		return _$.json(getPlayerAbilities(data[1]));
	}
	//$("8f976e22-78bc-3fe1-8ee5-cf5ff56347b9").setPAB({"opencontainers": false});
	this.setPAB = (ab)=>{														//设置玩家能力表
		return (typeof ab == "object")?setPlayerAbilities(data[1],_$.jsonStr(ab)):setPlayerAbilities(data[1],ab);
	}
	this.getPAT = ()=>{															//读取玩家属性表
		return _$.json(getPlayerAttributes(data[1]));
	}
	//$("8f976e22-78bc-3fe1-8ee5-cf5ff56347b9").setPAT({"attack_damage": 9999});
	this.setPAT = (ab)=>{														//设置玩家临时属性表
		return (typeof ab == "object")?setPlayerTempAttributes(data[1],_$.jsonStr(ab)):setPlayerTempAttributes(data[1],ab);
	}
	
	this.getPMAT = ()=>{														//读取玩家属性上限表
		return _$.json(getPlayerMaxAttributes(data[1]));
	}
	//$("8f976e22-78bc-3fe1-8ee5-cf5ff56347b9").setPMAT({"maxhealth": 200});
	this.setPMAT = (ab)=>{														//设置玩家属性上限表
		return (typeof ab == "object")?setPlayerMaxAttributes(data[1],_$.jsonStr(ab)):setPlayerMaxAttributes(data[1],ab);
	}
	this.getPItem = ()=>{														//获取玩家背包物品 包括末影箱
		return _$.json(getPlayerItems(data[1]));
	}
	this.setPItem = (ab)=>{														//设置玩家背包物品 包括末影箱
		return (typeof ab == "object")?setPlayerItems(data[1],_$.jsonStr(ab)):setPlayerItems(data[1],ab);
	}
	this.getPSItem = ()=>{														//获取玩家选择物品
		return _$.json(getPlayerSelectedItem(data[1]));
	}
	
	this.AddPI = (id,aux,count)=>{												//给玩家物品
		if(typeof id == "number"){
			return addPlayerItem(data[1],id,aux,count);
		}else if(typeof id == "object"){
			return addPlayerItemEx(data[1],_$.jsonStr(id));
		}else{
			return addPlayerItemEx(data[1],id);
		}
	}
	this.getPEff = ()=>{														//获取玩家的药水效果
		return _$.json(getPlayerEffects(data[1]));
	}
	this.setPEff = (ab)=>{														//设置玩家的药水效果
		return (typeof ab == "object")?setPlayerEffects(data[1],_$.jsonStr(ab)):setPlayerEffects(data[1],ab);
	}
	
	this.setPBB = (title,b)=>{													//设置玩家自定义Boos血条
		return setPlayerBossBar(data[1],title,b);
	}
	this.delPBB = ()=>{															//清除玩家自定义血条
		return removePlayerBossBar(data[1]);
	}
	this.setPS = (title,ab)=>{													//设置玩家侧边计分板
		return (typeof ab == "object")?setPlayerSidebar(data[1],title,_$.jsonStr(ab)):setPlayerSidebar(data[1],title,ab);
	}
	this.delPS = ()=>{															//清除玩家侧边计分板
		return removePlayerSidebar(data[1]);
	}
	
	this.getPPAG = ()=>{														//读取玩家权限和模式
		return _$.json(getPlayerPermissionAndGametype(data[1]));
	}
	this.setPPAG = (ab)=>{														//设置玩家权限或模式
		return (typeof ab == "object")?setPlayerPermissionAndGametype(data[1],_$.jsonStr(ab)):setPlayerPermissionAndGametype(data[1],ab);
	}
	this.info = ()=>{															//查询玩家信息
		return _$.json(_$.uncode(selectPlayer(data[1])));
	}
	this.tpserver = (ip,port = 19132)=>{										//传送玩家到其他服务器
		return transferserver(data[1],ip,port);
	}
	this.tp = (x,y,z,dim)=>{													//传送玩家到一个位置 或者传送到其他玩家的位置
		if(typeof x == "string"){
			if(!_$.isuuid(x)){
				x = _$.nametouuid(x);
			}
			let playerinfo = _$.json(selectPlayer(x));
			return teleport(data[1],playerinfo.XYZ.x,playerinfo.XYZ.y,playerinfo.XYZ.z,playerinfo.dimensionid);
		}else{
			return teleport(data[1],x,y,z,dim);
		}
	}
	this.talkAs = (t)=>{														//模仿玩家说话
		return talkAs(data[1],t);
	}
	this.cmdAS = (cmd)=>{														//模仿玩家执行指令
		return runcmdAs(data[1],cmd);
	}
	this.dissconnect = (text)=>{												//断开一个玩家的连接,text:提示信息
		return disconnectClient(data[1],text);
	}
	this.say = (text)=>{														//发送一个仅该玩家可见的提示文本给这个玩家 text:文本内容
		return sendText(data[1],text);
	}
	this.getscorevalue = (text)=>{												//获取玩家计分板指定项的数值	（注：特定情况下会自动创建计分板）
		return getscoreboard(data[1],text);
	}
	this.setscoreValue = (text,value)=>{										//设置玩家计分板指定项的数值 返回是否设置成功	（注：特定情况下会自动创建计分板）
		return setscoreboard(data[1],text,value);
	}
	this.PlayerIP = ()=>{														//获取指定玩家的ip
		return getPlayerIP(data[1]);
	}
	
	
	
//[例] let fid = sendSimpleForm('8f976e22-78bc-3fe1-8ee5-cf5ff56347b9', '致命选项', '请选择：', '["生存","死亡","求助"]')
	this.SForm = (title,content,btn,fun,time = 0)=>{							//发送简单表单 标题 内容 按钮组 回调 超时时间
		if(typeof btn == "object"){
			btn = _$.jsonStr(btn);
		}
		let n = sendSimpleForm(data[1],title,content,btn);
		if(n == 0){
			return false;	//失败
		}
		formdata[n] = fun;
		if(time != 0){
			_$.timeout(()=>{
				delete formdata[n];
				_$.reform(n);
			},time);
		}
		return true;
	}
	
	this.MForm = (title,content,btn1,btn2,fun,time = 0)=>{						//发送对话框 点击前按钮反馈true,点击后按钮反馈false
		let n = sendModalForm(data[1],title,content,btn1,btn2);
		if(n == 0){
			return false;
		}
		formdata[n] = fun;
		if(time != 0){
			_$.timeout(()=>{
				delete formdata[n];
				_$.reform(n);
			},time);
		}
		return true;
	}
//[例] let fid = sendCustomForm('8f976e22-78bc-3fe1-8ee5-cf5ff56347b9', '{"content":[{"type":"label","text":"这是一个文本标签"},{"placeholder":"水印文本","default":"","type":"input","text":""},{"default":true,"type":"toggle","text":"开关~或许是吧"},{"min":0.0,"max":10.0,"step":2.0,"default":3.0,"type":"slider","text":"游标滑块！？"},{"default":1,"steps":["Step 1","Step 2","Step 3"],"type":"step_slider","text":"矩阵滑块？!"},{"default":1,"options":["Option 1","Option 2","Option 3"],"type":"dropdown","text":"如你所见，下拉框"}], "type":"custom_form","title":"这是一个自定义窗体"}')

	this.CForm = (form,fun,time = 0)=>{											//发送自定义表单
		if(typeof form == "object"){
			form = _$.jsonStr(form);
		}
		let n = sendCustomForm(data[1],form);
		if(n == 0){
			return false;
		}
		formdata[n] = fun;
		if(time != 0){
			_$.timeout(()=>{
				delete formdata[n];
				_$.reform(n);
			},time);
		}
		return true;
	}
	
	this.say_cmd = (t)=>{
		let rawtxt = {};
		rawtxt.rawtext = [];
		let text = {};
		text.text = t;
		rawtxt.rawtext.push(text);
		_$.cmd('tellraw ' + '"' + data[0] + '" ' + _$.jsonStr(rawtxt));
	}
}

_$.version = "2.0.0";
_$.isempty = v => v === undefined || v == undefined || v == "undefined" || v == null || v == "null" || v == "";
_$.trim = s => s.replace(/(^\s*)|(\s*$)/g,"");									//去除首位空格

_$.isuuid = s =>{let re = /\w{8}(-\w{4}){3}-\w{12}/;return re.test(s)};
_$.nametouuid=n=>{for(a=0;a<playerlist.length;a++){if(playerlist[a]["playername"]==n){return playerlist[a]["uuid"]}};let Player=JSON.parse(_$.getplayer());playerlist=Player;for(i=0;i<Player.length;i++){if(Player[i]["playername"]==n){return Player[i]["uuid"]}};return null};
_$.json = JSON.parse;															//JSON 反序列化
_$.jsonStr = JSON.stringify														//JSON 序列化为字符串
_$.uncode = unescape;
_$.encode = escape;

_$.read = fileReadAllText;														//读文件
_$.write = (f,t,a = false)=> a ? fileWriteAllText(f,t):fileWriteLine(f,t);		//写文件 f:文件 t:内容 a:是否全部写入/还是追加一行
_$.fExists = fileExists;														//判断文件是否存在 一个字符串参数 返回bool
_$.fDelete = fileDelete;														//删除文件 一个字符串参数 返回bool
_$.fCopy = fileCopy;															//复制文件 两个字符串参数 返回bool
_$.fMove = fileMove;															//移动文件 两个字符串参数 返回bool
_$.mkdir = dirCreate;															//创建文件夹1 一个字符串参数 返回bool
_$.mkdir2 = mkdir;																//创建文件夹2 一个字符串参数 返回bool
_$.dExists = dirExists;															//判断文件夹是否存在 一个字符串参数 返回bool
_$.dDelete = dirDelete;															//删除文件夹 一个字符串参数 返回bool
_$.dMove = dirMove;																//移动文件夹 两个字符串参数 返回bool

_$.setcmd = setCommandDescribe;													//注册cmd指令信息
_$.time = TimeNow;																//返回当前时间字符串;
_$.setdata = setShareData;
_$.getdata = getShareData;
_$.deldata = removeShareData;
_$.log = t={																	//写日志到控制台
	if(typeof t == "object"){
		log(_$.jsonStr(t));
	}else{
		log(t);
	}
};

//_$.run = runScript;															//运行脚本
_$.cmd = runcmd;																//运行命令 控制台不回显
_$.say = t => _$.cmd("say "+ t);												//发送全体玩家文本消息
_$.getplayer = getOnLinePlayers;												//获取在线玩家列表
_$.setworld = setStructure;														//let r = setStructure(fileReadAllText('data.json'), 0, '{"x":0, "y":4, "z":0}', 0, true, true) 返回是否成功
_$.getworld = getStructure;														//let d = getStructure(0, '{"x":0, "y":4, "z":0}', '{"x":10, "y":14, "z":10}', false, true) //返回JSON字符串
_$.reform = releaseForm;														//丢弃表单


_$.get = (url,data = "",fun = (e)=>{})=>{request(url,"get",data,fun)};			//网络Get请求
_$.post = (url,data = "",fun = (e)=>{})=>{request(url,"post",data,fun)};		//网络post请求

_$.timeout = setTimeout;														//延时执行一段函数 fun 函数体，int ms 延时毫秒
_$.interval = (a,b)=>{															//循环执行一段函数 【1】fun 函数, int ms 毫秒 返回标识 int id 【2】int id 删除此id的计时器
	if(typeof a == "function"){
		return setInterval(a,b);
	}else{
		clearInterval(a);
	}
}
_$.getPath = getWorkingPath;													//获取环境目录
_$.startListen = startLocalHttpListen;											//建立一个TCP监听 int端口、fun callback 返回id
_$.stopListen = stopLocalHttpListen;											//停止监听 int id, 是否关闭成功
_$.resetListen = resetLocalHttpListener;										//重写监听处理方法 int id 、 fun 方法 返回bool
_$.setMotd = setServerMotd;														//设置服务器 Motd

_$.runJSEngine = JSErunScript;													//运行官方脚本引擎脚本 [1] 字符串 JS脚本 , [2] fun callback
_$.seedJSEngBrd = JSEfireCustomEvent;											//发送一个脚本引擎自定义广播事件 [1] 字符串 广播标识 ，[2] 事件文本内容 ，[3] fun calback 
_$.getsbval = getscoreById;														//获取一个计分板项目分数 [1] int 计分板id ，[2] string 计分板对应项目名称
_$.setsbval = setscoreById;														//设置一个计分板项目分数 [1] int 计分板id ，[2] string 计分板对应项目名称 [3] int value
_$.getAllsb = getAllScore;														//获取所有计分板的计分项 nbt
_$.getColor = getMapColors;														//获取一个位置对应的区块颜色 需要区块是活动状态[1]X [2]Y [3]Z [4] 维度id
_$.getPlayerData = exportPlayersData;											//导出所有离线玩家数据 服务器加载完成后才能调用
_$.setPlayerData = importPlayersData;											//导入所有离线玩家数据 服务器加载完成后才能调用[1] JSON字符串


_$.iniread = (path,item,key,defvalue) => {
	let file = _$.read(path);
	if(_$.isempty(file)||file.indexOf("\n")==-1){return defvalue}
	let array = file.split("\n");
	for(i=0;i<array.length;i++){
		if(_$.trim(array[i]) == "["+item+"]"){
			for(j=i+1;j<array.length;j++){
				if(_$.trim(array[j])[0] != "["){
					if(_$.isempty(_$.trim(array[j])) || _$.trim(array[j])[0] == ";" || array[j].indexOf("=") == -1){
						continue;
					}else{
						let keyarray = array[j].split("=");
						if(_$.trim(keyarray[0]) == key){
							return _$.trim(keyarray[1]);
						}
					}
				}else{
					return defvalue;
				}
			}
			return defvalue;
		}
	}
	return defvalue;
}

_$.iniwrite = (path,item,key,value)=>{
	let file = _$.read(path);
	if(_$.isempty(file)){
		return _$.write(path,"["+item+"]\n"+key+"="+value,true);
	}else{
		if(file.indexOf("\n")==-1){
			if(_$.trim(file)=="["+item+"]"){
				return _$.write(path,key+"="+value,false);
			}
		}
		let array = file.split("\n");
		for(i=0;i<array.length;i++){
			if(_$.trim(array[i])=="["+item+"]"){
				for(j=i+1;j<array.length;j++){
					if(_$.trim(array[j])[0] != "["){
						if(_$.isempty(_$.trim(array[j])) || _$.trim(array[j])[0] == ";" || array[j].indexOf("=") == -1){
							continue;
						}else if(array[j].indexOf("=") != -1){
							let keyarray = array[j].split("=");
							if(_$.trim(keyarray[0])==key){
								keyarray[1]=value;
								array[j] = keyarray.join("=");
								return _$.write(path,array.join("\n"),true);
							}
						}
					}else{
						array.splice(j,0,key+"="+value);
						return _$.write(path,array.join("\n"),true);
					}
				}
				array.push(key+"="+value);
				return _$.write(path,array.join("\n"),true);
			}
		}
		array.push("["+item+"]",key+"="+value);
		return _$.write(path,array.join("\n"),true);
	}
}

//简单计分板 利用指令修改计分板内容
_$.simplesb = {
	//添加一个计分板
	addsb:function(tag,title){
		_$.cmd("scoreboard objectives add "+tag+" dummy "+title);
	},
	//移除一个计分板
	removesb:function(tag){
		_$.cmd("scoreboard objectives remove "+tag);
	},
	//设置计分板的显示位置["sidebar","belowname","list"]//右侧、玩家名字下方、暂停菜单玩家列表
	showsb:function(tag,pos="sidebar"){
		_$.cmd("scoreboard objectives setdisplay "+pos+" "+tag);
	},
	//添加并设置一个玩家的分数 player支持玩家名,玩家标签选择器(@a @e[type=player])
	setval:function(tag,player,value){
		_$.cmd("scoreboard players set "+player+" "+tag+" "+value);
	},
	//扣除一个玩家的分数
	rmval:function(tag,player,value){
		_$.cmd("scoreboard players remove "+player+ " " +tag+" "+value);
	},
	//删除(清空)一个计分板玩家
	delplayer:function(tag,player){
		_$.cmd("scoreboard players reset "+player+" "+tag)
	}
}


addBeforeActListener("onFormSelect",function(e){
	var je=_$.json(e);
	je.selected = _$.json(je.selected);
	if (typeof formdata[je.formid] == "function"){
		formdata[je.formid](je);
		delete formdata[je.formid];
	}
	return true;
})

