/**
 * Created by xzk on 2016/12/24.
 * 功能：新建文件夹（放在第一个，出现重命名框，点击对号保存并更新数据，点击叉号删除本次新建的文件夹。如果已经存在名字，则自动在后面添加序号或者弹出弹窗提示）；
 * 重命名:只有在选中一个的时候才可以重命名，选中多个的时候不可以重命名。输入框的文字默认是文件夹原来的名字。并判断更新后的名字是否已经存在，存在则弹窗，否则确定文字并更新数据;
 * 删除：所有勾选的删除，更新数据；
 * 双击进入子集，顶部面包屑导航 :拿到第一级数据注意数据结构（一维数组，不要使用多维数组，除非数据量非常庞大
 *              面包屑导航：path #path=文件夹1/文件夹1-1
 *
 * 判断一个节点是否包含另一个节点
 * 使用try catch接受判断滚动条是否出现时的异常
 */

//文件区域   移入显示边框，点击选中，移除隐藏，点击上面相应按钮进行操作
var oFilesBar = document.getElementById('filesBar');  //仅文件夹主体div
var oFilesUl = oFilesBar.getElementsByTagName('ul')[0];  //仅文件夹主体div
var aFilesLi = oFilesBar.getElementsByTagName('li');  //文件夹li的集合
var oCover = document.getElementById('cover');
var oCoverInp = oCover.getElementsByTagName('input')[0];
var oEnsureFile = document.getElementById('ensureFile');
var oConcelFile = document.getElementById('concelFile');
var oNameFile = document.getElementById('nameFile'); //重命名按钮
var oRemveFile = document.getElementById('removeFile'); //删除按钮
var iAllNum = document.getElementById('allNum');
var oAllCheck = document.getElementsByClassName('allCheck')[0];
var oAllFiles = document.getElementsByClassName('allFiles')[0];
var oSortDate = document.getElementsByClassName('sortDate')[0];
var oLiNav = document.getElementById('liNav');
var oMenu = document.getElementById('menu'); //右击的弹出菜单
var aMenLi = oMenu.getElementsByTagName('li');
var beLine = false;//控制页面排列布局
//获取覆盖层的各个子节点
var oI = oCover.children[0];
var oDiv = oCover.children[1];
var oInput = oDiv.children[0];
var oSure = oDiv.children[1];
var oConcle = oDiv.children[2];
var pathId = [];//给rendNav传参
var iFilesUlX = document.getElementById('filesUl').getBoundingClientRect().left; //拖拽二变量
var iFilesUlY = document.getElementById('filesUl').getBoundingClientRect().top;


/*************************×××××××××××××初始化×××××××××××*********************************/
var iHash = location.hash?location.hash.split('=')[1]:'0';
rendAll(Number(iHash));
/***渲染文件夹区域函数rendAll rendDOM( 根据data数据创建DOM，并return oLi )  渲染文件导航区域函数***/
function rendAll(pId) { //参数n是pId
    oFilesUl.innerHTML = '';
    var aData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pId == pId) {
            aData.push(data[i]);
        }
    }
    for (var i = 0; i < aData.length; i++) {
        var oLi = rendDom(aData[i]);
        oFilesUl.appendChild(oLi);
    }
}
function rendDom(oData) {
    var oLi = document.createElement('li');
    var divParent = document.createElement('div');
    var divIco = document.createElement('div');
    var oP = document.createElement('p');
    divIco.className = 'icon2';
    divParent.className = 'div-parent';
    divParent.appendChild(divIco);
    oP.innerHTML = oData.name;
    oLi.appendChild(divParent);
    oLi.appendChild(oP);
    oLi.id = oData.id;
    oLi.pId = oData.pId;
    divParent.onmouseover = function () {
        if(!beLine){
            divParent.style.border = '2px solid blue';
            divIco.style.display = 'block';
        }
        divIco.onclick = function () {

            if(beLine){
                if (divIco.className == 'icon2-changeLine') {  //选中状态
                    divIco.className = 'icon2';
                } else {                               // 未选中状态
                    divIco.className = 'icon2-changeLine';
                }
            }else{
                if (divIco.className == 'icon2-change') {  //选中状态
                    divIco.className = 'icon2';
                } else {                               // 未选中状态
                    divIco.className = 'icon2-change';
                }
            }
            fnAllCheck();
        }
        divIco.ondblclick = function (ev) {
            ev.cancelBubble = true
        }
    }
    divParent.onmouseout = function () {
        fnMouseOut(divIco)
    }
    oLi.ondblclick = function () {
        //每次新建都要将ul拉回顶部
        oFilesUl.style.top = 0 + 'px';
        oScrollBar.style.top = 0 + 'px';
        //渲染子集页面
        rendAll(this.id);
        //更新顶部导航
        pathId.push(this.id);
        //存储当前父级文件夹的id
        rendNav(pathId);
        //改变hash，以便将来循环使用
        location.hash = 'id=' + this.id;
    }
    oLi.onmouseover = function () {
        if(beLine){
            for(var i=0;i<aFilesLi.length;i++){
                if(aFilesLi[i].children[0].children[0].className != 'icon2-changeLine'){

                    aFilesLi[i].style.backgroundColor = 'white';
                }
            }
            divIco.style.display = 'block';
            this.style.backgroundColor = 'rgba(140,137,182,0.56)';
        }
    }
    oLi.onmouseout = function () {
        fnMouseOut(divIco)
    }
    //右击  不需要区分排列布局
    oLi.oncontextmenu = function (ev) {
        ev.preventDefault();
        //判断当前点击的是不是选中的
        if (divIco.className == 'icon2') {
            //点击的是没有选中的  需要将之前选中的全部清空
            for (var i = 0; i < aFilesLi.length; i++) {
                aFilesLi[i].children[0].children[0].className = 'icon2';
            }
            if(beLine){
                divIco.className = 'icon2-changeLine';
            }else{
                divIco.className = 'icon2-change';
            }

            for (var i = 0; i < aFilesLi.length; i++) {
                fnMouseOut(aFilesLi[i].children[0].children[0]);
            }
        }
        var iMouseX = ev.clientX;
        var iMouseY = ev.clientY;
        oMenu.style.top = iMouseY + 'px';
        oMenu.style.left = iMouseX + 'px';
        oMenu.style.display = 'block';
        //判断是否只有一个Li选中，即重命名功能是否可用
        var aDivParent = oFilesUl.getElementsByClassName('div-parent');
        var aDivIco = [];
        for (var i = 0; i < aDivParent.length; i++) {
            aDivIco.push(aDivParent[i].children[0]);
        }
        var num = 0;//计一共有几个input选中
        if(beLine){
            for (var i = 0; i < aDivIco.length; i++) {
                if (aDivIco[i].className == 'icon2-changeLine') {
                    num++;
                }
            }
        }else{
            for (var i = 0; i < aDivIco.length; i++) {
                if (aDivIco[i].className == 'icon2-change') {
                    num++;
                }
            }
        }
        //在每次右击时，把之前存储的mouseover事件注销
        for(var i=0;i<aMenLi.length;i++){
            aMenLi[i].onmouseover = null;
        }
        if (num == 1) {
            //重命名可用
            for (var i = 0; i < aMenLi.length; i++) {
                aMenLi[i].onmouseover = function () {
                    for (var i = 0; i < aMenLi.length; i++) {
                        aMenLi[i].style.color = '#616161';
                        aMenLi[i].style.backgroundColor = '#fff';
                    }
                    this.style.color = '#fff';
                    this.style.backgroundColor = 'blue';
                }
                aMenLi[i].onmouseout = function () {
                    this.style.color = '#616161';
                    this.style.backgroundColor = '#fff';
                }
                aMenLi[0].onclick = function () {
                    fnCreatFile();
                    oMenu.style.display = 'none';
                }
                aMenLi[1].onclick = function () {
                    fnRemoveFile();
                    oMenu.style.display = 'none';
                };
                aMenLi[2].onclick = function () {
                    fnNameFile();
                    oMenu.style.display = 'none';
                };
            }
        } else {
            //重命名不可用
            aMenLi[2].style.color = '#ababab';
            aMenLi[2].onmousemove = null;
            for (var i = 0; i < aMenLi.length - 1; i++) {
                aMenLi[i].onmouseover = function () {
                    for (var i = 0; i < aMenLi.length - 1; i++) {
                        aMenLi[i].style.color = '#616161';
                        aMenLi[i].style.backgroundColor = '#fff';
                    }
                    this.style.color = '#fff';
                    this.style.backgroundColor = 'blue';
                }
                aMenLi[0].onclick = function () {
                    fnCreatFile();
                    oMenu.style.display = 'none';
                }
                aMenLi[1].onclick = function () {
                    fnRemoveFile();
                    oMenu.style.display = 'none';
                };
            }
        }
    }
    if(beLine){
        oLi.style.cssText = 'padding-left: 30px;width: 100%;height: 50px;border-bottom:1px solid #eee';
        divParent.style.cssText = 'border:none;background-position:0 8px;background-size:30px 31px;height: 50px;width: 30px;float: left;';
        divIco.style.cssText = 'margin-left: -18px;margin-top:14px';
        oP.style.cssText = 'display: inline-block;line-height:50px;height:50px;text-align:left;margin-left:8px;';
        if(divIco.className == 'icon2-change'){
            divIco.className = 'icon2-changeLine';
        }
    }
    return oLi;
}
document.onclick = function () {
    oMenu.style.display = 'none';
}
document.oncontextmenu = function (ev) {
    ev.preventDefault()
}


/*************************面包屑导航函数  监控hash改变函数*********************************/
function rendNav(pathId11) {
    oLiNav.innerHTML = '';
    //存储点击过的文件夹的name
    var navArr = [];
    for (var i = 0; i < pathId11.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (pathId11[i] == data[j].id) {
                navArr.push(data[j].name);
            }
        }
    }
    var oNavToNext = document.createElement('a');
    oNavToNext.innerHTML = '返回上一级 |';
    var oNavToAll = document.createElement('a');
    oNavToAll.innerHTML = '全部文件 >';
    oLiNav.appendChild(oNavToNext);
    oLiNav.appendChild(oNavToAll);
    for (var i = 0; i < pathId11.length; i++) {
        var oNavA = document.createElement('a');
        oNavA.innerHTML = ' ' + navArr[i] + ' >';
        console.log(pathId11[i] - 1)
        oLiNav.appendChild(oNavA);
    }
    //面包屑导航
    var aANav = oLiNav.getElementsByTagName('a');
    //返回上一级  重新渲染文件DOM 和 面包屑导航区 区分返回的是否是第一级
    oNavToNext.onclick = function () {
        //每次新建都要将ul拉回顶部
        oFilesUl.style.top = 0 + 'px';
        oScrollBar.style.top = 0 + 'px';
        if (pathId11.length == 1) {
            oLiNav.innerHTML = '全部文件';
            pathId = [];
            rendAll(0);
            location.hash = 'id=0';
        } else {
            pathId = pathId11.slice(0, pathId11.length - 1);
            rendNav(pathId);
            rendAll(pathId[pathId.length - 1]);
            location.hash = 'id=' + pathId[pathId.length - 1];
        }
    }
    //返回全部文件夹
    oNavToAll.onclick = function () {
        //每次新建都要将ul拉回顶部
        oFilesUl.style.top = 0 + 'px';
        oScrollBar.style.top = 0 + 'px';
        oLiNav.innerHTML = '全部文件';
        pathId = [];
        rendAll(0);
        location.hash = 'id=0';
    }
    //点击面包屑
    for (var i = 2; i < aANav.length; i++) {
        aANav[i].index = i;
        aANav[i].onclick = function () {
            //每次新建都要将ul拉回顶部
            oFilesUl.style.top = 0 + 'px';
            oScrollBar.style.top = 0 + 'px';
            var iEnd = this.index - 1;
            pathId = pathId11.slice(0, iEnd);
            rendNav(pathId);
            rendAll(pathId[pathId.length - 1]);
            location.hash = 'id=' + pathId[pathId.length - 1];
        }
    }
}
window.onhashchange = function () {
    iHash = location.hash.split('=')[1];
    rendAll(Number(iHash));
    //更新加载文件夹数目
    loadFilesNum();
    scrollBar();
    fnAllCheck();
}


/*************************新建文件夹按钮  新建函数以及渲染文件总数函数*********************************/
var creatFile = document.getElementById('creatFile');
creatFile.onclick = fnCreatFile;
function fnCreatFile() {
    //每次新建都要将ul拉回顶部
    oFilesUl.style.top = 0 + 'px';
    oScrollBar.style.top = 0 + 'px';
    //点击新建一个DOM
    var newData = {};
    var newId = 1;
    for (var i = 0; i < data.length; i++) {
        newId++;
    }
    newData.id = newId;
    newData.pId = location.hash.split('=')[1];
    newData.name = '';
    var oLi = rendDom(newData);
    oFilesUl.insertBefore(oLi, oFilesUl.children[0]);

    data.push(newData);
    //操作重命名,因为不需要判断是否有一个Li已经被选中，故不可以直接调用重命名函数
    oCover.style.display = 'block';

    var iMarginLeft = getComputedStyle(oLi, null).marginLeft;
    var l = oLi.offsetLeft - parseInt(iMarginLeft);
    var t = oLi.offsetTop;
    oCover.style.left = l + 'px';
    oCover.style.top = t + 'px';
    oCoverInp.value = '新建文件夹';
    oCoverInp.focus();
    if(beLine){
        rendLineDiv();
        oCover.className = 'lineCover';
        oI.className = 'lineEmpty';
        oDiv.className = 'lineDiv';
        oInput.className = 'lineInput';
        oSure.className = 'lineEnsureFile';
        oConcle.className = 'lineConcelFile';
    }else{
        oCover.className = 'boxCover';
        oI.className = 'boxEmpty';
        oDiv.className = 'boxDiv';
        oInput.className = 'boxInput';
        oSure.className = 'boxEnsureFile';
        oConcle.className = 'boxConcelFile';
    }
    oEnsureFile.onclick = function () {
        //隐藏遮罩层，并修改文件名
        ensure(oLi);
        //更新数据
        data[oLi.id - 1].name = oCoverInp.value;
        //更新加载文件夹数目
        loadFilesNum();
        scrollBar();
        fnAllCheck();
    }
    oConcelFile.onclick = function () {
        //删除节点
        oFilesUl.removeChild(oLi);
        oCover.style.display = 'none';
        //更新数据
        data.pop(data.length - 1);
        //更新加载文件夹数目
        loadFilesNum();
        scrollBar();
        fnAllCheck();
    }
    loadFilesNum();
    scrollBar();
    fnAllCheck();

}
function loadFilesNum() {
    var aData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pId == location.hash.split('=')[1]) {
            aData.push(data[i]);
        }
    }
    iAllNum.innerHTML = aData.length;
}


/*************************重命名按钮  重命名函数以及确定函数*********************************/
oNameFile.onclick = fnNameFile;
function fnNameFile() {
    var aDivParent = oFilesUl.getElementsByClassName('div-parent');
    var aDivIco = [];
    for (var i = 0; i < aDivParent.length; i++) {
        aDivIco.push(aDivParent[i].children[0]);
    }
    var num = 0;//计一共有几个input选中
    for (var i = 0; i < aDivIco.length; i++) {
        if (aDivIco[i].className == 'icon2-change' ||aDivIco[i].className == 'icon2-changeLine') {
            num++;
        }
    }
    if (num == 1) {
        //只有一个选中的时候才可以操作
        for (var i = 0; i < aDivIco.length; i++) {
            if (aDivIco[i].className == 'icon2-change' ||aDivIco[i].className == 'icon2-changeLine') {
                var thisLi = aDivIco[i].parentNode.parentNode; //选中的li
            }
        }
        //thisLi.children[1].innerHTML = '';
        if(beLine){
            oCover.className = 'lineCover';
            oI.className = 'lineEmpty';
            oDiv.className = 'lineDiv';
            oInput.className = 'lineInput';
            oSure.className = 'lineEnsureFile';
            oConcle.className = 'lineConcelFile';
        }else{
            oCover.className = 'boxCover';
            oI.className = 'boxEmpty';
            oDiv.className = 'boxDiv';
            oInput.className = 'boxInput';
            oSure.className = 'boxEnsureFile';
            oConcle.className = 'boxConcelFile';
        }
        oCover.style.display = 'block';
        oCoverInp.focus();
        var iMarginLeft = getComputedStyle(thisLi, null).marginLeft;
        var l = thisLi.offsetLeft - parseInt(iMarginLeft);
        var t = thisLi.offsetTop;
        oCover.style.left = l + 'px';
        oCover.style.top = t + 'px';
        oCoverInp.value = '新建文件夹';
        oEnsureFile.onclick = function () {
            //隐藏遮罩层，并修改文件名
            ensure(thisLi);
            //更新数据
            data[thisLi.id - 1].name = oCoverInp.value;
        }
        oConcelFile.onclick = function () {
            oCover.style.display = 'none';
        }
    } else {
        alert('每次只能修改一个文件夹')
    }
}
function ensure(obj) {
    //如果存在同名，则弹出提示
    var aData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pId == location.hash.split('=')[1]) {
            aData.push(data[i]);
        }
    }
    for (var i = 0; i < aData.length; i++) {
        if (aData[i].name == oCoverInp.value) {
            alert('该名字已存在');
            return;
        }
    }
    oCover.style.display = 'none';
    obj.children[1].innerHTML = oCoverInp.value;
}
/*************************删除按钮  删除函数*********************************/
oRemveFile.onclick = fnRemoveFile;
function fnRemoveFile() {
    var aDivParent = oFilesUl.getElementsByClassName('div-parent');
    var aDivIco = [];
    for (var i = 0; i < aDivParent.length; i++) {
        aDivIco.push(aDivParent[i].children[0]);
    }
    //循环判断每个li是否被选中
    for (var i = 0; i < aDivIco.length; i++) {
        if (aDivIco[i].className == 'icon2-change' || aDivIco[i].className == 'icon2-changeLine') {
            var thisLi = aDivIco[i].parentNode.parentNode; //选中的li
            //删除节点
            oFilesUl.removeChild(thisLi);
            oCover.style.display = 'none';
            //更新数据  注意此处要循环判断
            for (var j = 0; j < data.length; j++) {
                if (thisLi.id == data[j].id || thisLi.id == data[j].pId) {
                    console.log(thisLi.id, data[j].id, data[j].pId, j);
                    data.splice(j, 1);
                    j--;
                }
            }
        }
    }
    loadFilesNum();
    scrollBar();
    fnAllCheck();
}


/*************************点击全选  判断全选函数*********************************/
oAllCheck.onclick = function () {
    var aDivParent = oFilesUl.getElementsByClassName('div-parent');
    var aDivIco = [];
    for (var i = 0; i < aDivParent.length; i++) {
        aDivIco.push(aDivParent[i].children[0]);
    }
    if (!this.checked) {
        for (var i = 0; i < aDivIco.length; i++) {
            aDivIco[i].className = 'icon2';
            aDivParent[i].style.border = 'none';
            aDivIco[i].style.display = 'none';
        }
    } else {
        for (var i = 0; i < aDivIco.length; i++) {
            aDivIco[i].className = 'icon2-change';
            aDivParent[i].style.border = '2px solid blue';
            aDivIco[i].style.display = 'block';
        }
    }
}
function fnAllCheck (){
    var beAll = true;
    for(var i=0;i<aFilesLi.length;i++){
        if(aFilesLi[i].getElementsByTagName('div')[1].className == 'icon2'){
            beAll = false;
        }
    }
    if(!aFilesLi.length){
        beAll=false;
    }
    if(beAll){
        oAllCheck.checked = true;
    } else{
        oAllCheck.checked = false;
    }
}

/*************************最左侧导航菜单  点击折叠展开*********************************/
oAllFiles.onclick = function () {
    if (this.children[1].style.display == 'block') {
        this.children[1].style.display = 'none';
        //this.children[0].style.color = '#3a83f6';
    } else {
        this.children[1].style.display = 'block';
        this.children[0].style.color = '#3a83f6';
    }

}
oAllFiles.onmouseout = function () {
    this.children[0].style.color = '#636363';
}
oAllFiles.onmouseover = function () {
    this.children[0].style.color = '#3a83f6';
}


/*************************框选函数  line排列布局没有框选功能*****************************************
 * 分析
 *一、框选
 *1.画框
 *得在非li处按下才是画框，按下时记录坐标，移动时计算定位坐标和宽高
 *2.选中碰到的li
 *选中的li变蓝,状态变成选中
 *二、li
 *在选中的li上按下
 *1.拖拽
 *move的时候，所有被选中的li跟着移动
 *在没选中的li上按下
 *2.单选
 *前边选中的取消，当前的选中可以拖拽
 *3.多选
 *ctrl按下
 * **********************************************************/
var body = document.getElementsByTagName('body')[0];
var oBorderBox = document.getElementById('borderBox');
var oFilesUl = document.getElementById('filesUl');
oFilesBar.addEventListener("mousedown", selectBox, false);
function selectBox(ev) {
    if(!beLine){
        ev.preventDefault();
        var iStarX = ev.clientX;
        var iStarY = ev.clientY;
        var iBoxMinX = oFilesUl.getBoundingClientRect().left;
        var iBoxMaxX = oFilesUl.getBoundingClientRect().right;
        var iBoxMinY = oFilesUl.getBoundingClientRect().top;
        var beTrue = true;//是否可以出现选框
        //判断是否可以出现选框  ,  只要有个一碰到，则为假不可以出现选框
        for (var i = 0; i < aFilesLi.length; i++) {
            aFilesLi[i].pos = aFilesLi[i].getBoundingClientRect();
            if (iStarX > aFilesLi[i].pos.left && iStarX < aFilesLi[i].pos.right && iStarY > aFilesLi[i].pos.top && iStarY < aFilesLi[i].pos.bottom) {
                beTrue = false;
            }
        }
        if (beTrue) {
            //在文件区域才可以选框
            if (iStarX > iBoxMinX && iStarY > iBoxMinY && iStarX < iBoxMaxX) {
                //在没有按下Ctrl时,每次框选前先清空

                if (ev.ctrlKey == false) {
                    document.onmousemove = function (ev) {
                        ev.preventDefault();
                        var iEndX = ev.clientX;
                        var iEndY = ev.clientY;
                        if (iEndX < iBoxMinX) {
                            iEndX = iBoxMinX;
                        }
                        if (iEndY < iBoxMinY) {
                            iEndY = iBoxMinY;
                        }
                        var iHeight = Math.abs(iStarY - iEndY);
                        var iWidth = Math.abs(iStarX - iEndX);
                        oBorderBox.style.display = 'block';
                        if (iEndX > iStarX && iEndY > iStarY) {
                            oBorderBox.style.top = iStarY + 'px';
                            oBorderBox.style.left = iStarX + 'px';
                        }
                        if (iEndX > iStarX && iEndY < iStarY) {
                            oBorderBox.style.top = iEndY + 'px';
                            oBorderBox.style.left = iStarX + 'px';
                        }
                        if (iEndX < iStarX && iEndY > iStarY) {
                            oBorderBox.style.top = iStarY + 'px';
                            oBorderBox.style.left = iEndX + 'px';
                        }
                        if (iEndX < iStarX && iEndY < iStarY) {
                            oBorderBox.style.top = iEndY + 'px';
                            oBorderBox.style.left = iEndX + 'px';
                        }
                        oBorderBox.style.height = iHeight + 'px';
                        oBorderBox.style.width = iWidth + 'px';
                        //检测碰撞 拖拽框的最大与最小值
                        var iMaxX = iEndX > iStarX ? iEndX : iStarX;
                        var iMaxY = iEndY > iStarY ? iEndY : iStarY;
                        var iMinY = iEndY < iStarY ? iEndY : iStarY;
                        var iMinX = iEndX < iStarX ? iEndX : iStarX;
                        //在每次框选之前，首先要清空之前的
                        for (var i = 0; i < aFilesLi.length; i++) {
                            var divParent = aFilesLi[i].getElementsByTagName('div')[0];
                            var divIco = aFilesLi[i].getElementsByTagName('div')[1];
                            divParent.style.border = 'none';
                            divIco.className = 'icon2';
                            divIco.style.display = 'none';
                            aFilesLi[i].pos = aFilesLi[i].getBoundingClientRect();
                            //如果碰撞上了
                            if (!(iMaxX < aFilesLi[i].pos.left || iMinX > aFilesLi[i].pos.right || iMaxY < aFilesLi[i].pos.top || iMinY > aFilesLi[i].pos.bottom)) {
                                divParent.style.border = '2px solid blue';
                                divIco.style.display = 'block';
                                divIco.className = 'icon2-change';
                            }
                        }
                    }
                } else {
                    //按下Ctrl时，要记住之前选中的li
                    var aNewArr = [];//存储之前未选中的li
                    for (var i = 0; i < aFilesLi.length; i++) {
                        var divIco = aFilesLi[i].getElementsByTagName('div')[1];
                        if (divIco.className == 'icon2') {
                            aNewArr.push(aFilesLi[i])
                        }
                    }
                    document.onmousemove = function (ev) {
                        ev.preventDefault();
                        var iEndX = ev.clientX;
                        var iEndY = ev.clientY;
                        if (iEndX < iBoxMinX) {
                            iEndX = iBoxMinX;
                        }
                        if (iEndY < iBoxMinY) {
                            iEndY = iBoxMinY;
                        }
                        var iHeight = Math.abs(iStarY - iEndY);
                        var iWidth = Math.abs(iStarX - iEndX);
                        oBorderBox.style.display = 'block';
                        if (iEndX > iStarX && iEndY > iStarY) {
                            oBorderBox.style.top = iStarY + 'px';
                            oBorderBox.style.left = iStarX + 'px';
                        }
                        if (iEndX > iStarX && iEndY < iStarY) {
                            oBorderBox.style.top = iEndY + 'px';
                            oBorderBox.style.left = iStarX + 'px';
                        }
                        if (iEndX < iStarX && iEndY > iStarY) {
                            oBorderBox.style.top = iStarY + 'px';
                            oBorderBox.style.left = iEndX + 'px';
                        }
                        if (iEndX < iStarX && iEndY < iStarY) {
                            oBorderBox.style.top = iEndY + 'px';
                            oBorderBox.style.left = iEndX + 'px';
                        }
                        oBorderBox.style.height = iHeight + 'px';
                        oBorderBox.style.width = iWidth + 'px';
                        //检测碰撞 拖拽框的最大与最小值
                        var iMaxX = iEndX > iStarX ? iEndX : iStarX;
                        var iMaxY = iEndY > iStarY ? iEndY : iStarY;
                        var iMinY = iEndY < iStarY ? iEndY : iStarY;
                        var iMinX = iEndX < iStarX ? iEndX : iStarX;

                        for (var i = 0; i < aNewArr.length; i++) {
                            //如果碰到了，表明可以选中
                            if (!(iMaxX < aNewArr[i].pos.left || iMinX > aNewArr[i].pos.right || iMaxY < aNewArr[i].pos.top || iMinY > aNewArr[i].pos.bottom)) {
                                var divParent = aNewArr[i].getElementsByTagName('div')[0];
                                var divIco = aNewArr[i].getElementsByTagName('div')[1];
                                divParent.style.border = '2px solid blue';
                                divIco.style.display = 'block';
                                divIco.className = 'icon2-change';
                            } else{
                                var divParent = aNewArr[i].getElementsByTagName('div')[0];
                                var divIco = aNewArr[i].getElementsByTagName('div')[1];
                                divParent.style.border = '2px solid white';
                                divIco.style.display = 'none';
                                divIco.className = 'icon2';
                            }
                        }
                    }
                }


                document.onmouseup = function () {
                    oBorderBox.style.display = 'none';
                    fnAllCheck();
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        } else {
            //不出现选框时，则说明鼠标位于文件li内，则执行拖拽函数
            //并且，鼠标因该位于已经选中的li上才可触发拖拽事件
            var aDragLi = []; //存储已经选中的li
            var beDrag = false;
            for (var i = 0; i < aFilesLi.length; i++) {
                if (aFilesLi[i].getElementsByTagName('div')[1].className == 'icon2-change') {
                    aDragLi.push(aFilesLi[i]);
                }
            }
            //判断只有鼠标位于li，移动时才能触发拖拽事件
            for (var i = 0; i < aDragLi.length; i++) {
                aDragLi[i].pos = aDragLi[i].getBoundingClientRect();
                if (aDragLi[i].pos.left < iStarX && aDragLi[i].pos.right > iStarX && aDragLi[i].pos.top < iStarY && aDragLi[i].pos.bottom > iStarY) {
                    beDrag = true;
                }
            }
            if (beDrag) {
                drag(ev);
            }
        }
    }

}


/*************************拖拽函数 **************************************************************
 * 注释部分演示错误 ： 浮动与定位同时需要存在，需求不清晰造成的功能缺陷
 * 拖动移位  1.千万不要忘了布局转化,应该给所有的li都定位，否则会覆盖前移
 *         2.检测碰撞  碰撞时mouseup时要更改数据库
 * **********************************************************/
/*function drag(ev) {
    //储存可以被拖动的li
    //布局转换
    for (var i = 0; i < aFilesLi.length; i++) {
        aFilesLi[i].style.left = aFilesLi[i].offsetLeft + 'px';
        aFilesLi[i].style.top = aFilesLi[i].offsetTop + 'px';
    }
    for (var i = 0; i < aFilesLi.length; i++) {
        aFilesLi[i].style.position = 'absolute';
    }
    //记录已经选择、可以移动的li
    var aNewFilesLi = Array.from(aFilesLi);
    var aDragLi = [];
    for (var i = 0; i < aNewFilesLi.length; i++) {
        if (aNewFilesLi[i].getElementsByTagName('div')[1].className == 'icon2-change') {
            aDragLi.push(aNewFilesLi[i]);
        }
    }
    //不需要移动的li
    var aNoDragLi = [];
    for (var i = 0; i < aNewFilesLi.length; i++) {
        if (aNewFilesLi[i].getElementsByTagName('div')[1].className !== 'icon2-change') {
            aNoDragLi.push(aNewFilesLi[i]);
        }
    }
    //克隆可以拖拽的li
    var aDragCloneLi = [];
    aDragLi.forEach(function (item) {
        aDragCloneLi.push(item.cloneNode(true));
    })
    console.log(aDragCloneLi)
    //给每个克隆的li添加阴影以及透明度
    aDragCloneLi.forEach(function (item) {
        item.style.boxShadow = '4px 4px 4px #222';
        item.style.opacity = '0.5';
    })
    //给每一可以拖拽的li添加鼠标移动事件
    for (var i = 0; i < aDragLi.length; i++) {
        aDragLi[i].pos = aDragLi[i].getBoundingClientRect();
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        document.addEventListener('mousemove', dragCloneLiMove, false);
    }
    //鼠标抬起后，判断是否有目标li（更新数据的pID），并取消mousemove/mouseup事件的绑定
    document.addEventListener('mouseup', function (ev) {
        //当鼠标抬起的时候需要检测是否需要更新数据  即碰撞检测
        var tarLi = null; //存储鼠标指向的li
        aNoDragLi.forEach(function (item01, index01, arr01) {
            //如果鼠标位于某一个li内，则执行
            if (aNoDragLi.some(function (item02, index02, arr02) {
                    var pos = item02.children[0].getBoundingClientRect();
                    return pos.left < ev.clientX && pos.right > ev.clientX && pos.top < ev.clientY && pos.bottom > ev.clientY
                }) && aDragLi[0].parentNode) {
                //获取将要放进的目标tarLi
                aNoDragLi.forEach(function (item02) {
                    var pos = item02.children[0].getBoundingClientRect();
                    if (pos.left < ev.clientX && pos.right > ev.clientX && pos.top < ev.clientY && pos.bottom > ev.clientY) {
                        tarLi = item02;
                    }
                })
                //更新DOM ，即将选中的li删除
                aDragLi.forEach(function (item03, index03, arr03) {
                    oFilesUl.removeChild(item03);
                })
                //跟新数据的pid
                var dragData = []
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < aDragLi.length; j++) {
                        if (data[i].id == aDragLi[j].id) {
                            dragData.push(data[i])
                        }
                    }
                }
                dragData.forEach(function (item05) {
                    item05.pId = tarLi.id;
                })
            }
        })
        dragLiMove(ev);
        //判断父节点是否包含子节点
        var beContains = contains(oFilesUl, aDragCloneLi[0])
        if (beContains) {
            aDragCloneLi.forEach(function (item) {
                oFilesUl.removeChild(item);
            })
        }
        document.removeEventListener('mousemove', dragCloneLiMove)
        document.removeEventListener('mouseup', arguments.callee)
    }, false)
    //选中的li移动函数
    function dragLiMove(ev) {
        var mouseNowX = ev.clientX;
        var mouseNowY = ev.clientY;
        var distenceX = mouseNowX - mouseX;
        var distenceY = mouseNowY - mouseY;

        for (var i = 0; i < aDragLi.length; i++) {
            aDragLi[i].nowPosLeft = aDragLi[i].pos.left - iFilesUlX + distenceX;
            aDragLi[i].nowPosTop = aDragLi[i].pos.top - iFilesUlY + distenceY;
            if (aDragLi[i].nowPosLeft < 0) {
                aDragLi[i].nowPosLeft = 0;
            }
            if (aDragLi[i].nowPosTop < 0) {
                aDragLi[i].nowPosTop = 0;
            }
            aDragLi[i].style.left = aDragLi[i].nowPosLeft + 'px';
            aDragLi[i].style.top = aDragLi[i].nowPosTop + 'px';
        }
    }

    //临时出现的li移动函数
    function dragCloneLiMove(ev) {
        ev.preventDefault();
        var mouseNowX = ev.clientX;
        var mouseNowY = ev.clientY;
        var distenceX = mouseNowX - mouseX;
        var distenceY = mouseNowY - mouseY;

        for (var i = 0; i < aDragCloneLi.length; i++) {
            aDragCloneLi[i].nowPosLeft = aDragLi[i].pos.left - iFilesUlX + distenceX;
            aDragCloneLi[i].nowPosTop = aDragLi[i].pos.top - iFilesUlY + distenceY;
            if (aDragCloneLi[i].nowPosLeft < 0) {
                aDragCloneLi[i].nowPosLeft = 0;
            }
            if (aDragCloneLi[i].nowPosTop < 0) {
                aDragCloneLi[i].nowPosTop = 0;
            }
            aDragCloneLi[i].style.left = aDragCloneLi[i].nowPosLeft + 'px';
            aDragCloneLi[i].style.top = aDragCloneLi[i].nowPosTop + 'px';
            oFilesUl.appendChild(aDragCloneLi[i]);
        }
        //当移动时，碰触到目标Li时，目标li显示蓝色边框
        for (var i = 0; i < aNoDragLi.length; i++) {
            aNoDragLi[i].children[0].style.border = '2px solid #fff';
            if (aNoDragLi[i].pos.left < mouseNowX && aNoDragLi[i].pos.right > mouseNowX && aNoDragLi[i].pos.top < mouseNowY && aNoDragLi[i].pos.bottom > mouseNowY) {
                aNoDragLi[i].children[0].style.border = '2px solid blue';
            }
        }
    }
}*/
function drag(ev) {
    //记录已经选择、可以移动的li
    var aNewFilesLi = Array.from(aFilesLi);
    var aDragLi = [];
    for (var i = 0; i < aNewFilesLi.length; i++) {
        if (aNewFilesLi[i].getElementsByTagName('div')[1].className == 'icon2-change' || aNewFilesLi[i].getElementsByTagName('div')[1].className == 'icon2-changeLine') {
            aDragLi.push(aNewFilesLi[i]);
        }
    }
    //不需要移动的li
    if(beLine){
        var aNoDragLi = [];
        for (var i = 0; i < aNewFilesLi.length; i++) {
            if (aNewFilesLi[i].getElementsByTagName('div')[1].className !== 'icon2-changeLine') {
                aNoDragLi.push(aNewFilesLi[i]);
            }
        }
    }else{
        var aNoDragLi = [];
        for (var i = 0; i < aNewFilesLi.length; i++) {
            if (aNewFilesLi[i].getElementsByTagName('div')[1].className !== 'icon2-change') {
                aNoDragLi.push(aNewFilesLi[i]);
            }
        }
    }

    //克隆可以拖拽的li
    var aDragCloneLi = [];
    aDragLi.forEach(function (item) {
        aDragCloneLi.push(item.cloneNode(true));
    })
    //给每个克隆的li添加阴影以及透明度
    aDragCloneLi.forEach(function (item) {
        item.style.boxShadow = '4px 4px 4px #222';
        item.style.opacity = '0.5';
        item.style.position = 'absolute';
    })
    /*//给每个克隆的li布局转换
    for (var i = 0; i < aDragCloneLi.length; i++) {
        aDragCloneLi[i].style.left = aDragCloneLi[i].offsetLeft + 'px';
        aDragCloneLi[i].style.top = aDragCloneLi[i].offsetTop + 'px';
    }
    for (var i = 0; i < aDragCloneLi.length; i++) {
        aDragCloneLi[i].style.position = 'absolute';
    }*/
    //给每一可以拖拽的li添加鼠标移动事件
    for (var i = 0; i < aDragLi.length; i++) {
        aDragLi[i].pos = aDragLi[i].getBoundingClientRect();
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        document.addEventListener('mousemove', dragCloneLiMove, false);
    }
    //鼠标抬起后，判断是否有目标li（更新数据的pID），并取消mousemove/mouseup事件的绑定
    document.addEventListener('mouseup', function (ev) {
        //当鼠标抬起的时候需要检测是否需要更新数据  即碰撞检测
        var tarLi = null; //存储鼠标指向的li
        aNoDragLi.forEach(function (item01, index01, arr01) {
            //如果鼠标位于某一个li内，则执行
            if (aNoDragLi.some(function (item02, index02, arr02) {
                    var pos = item02.children[0].getBoundingClientRect();
                    return pos.left < ev.clientX && pos.right > ev.clientX && pos.top < ev.clientY && pos.bottom > ev.clientY
                }) && aDragLi[0].parentNode) {
                //获取将要放进的目标tarLi
                aNoDragLi.forEach(function (item02) {
                    var pos = item02.children[0].getBoundingClientRect();
                    if (pos.left < ev.clientX && pos.right > ev.clientX && pos.top < ev.clientY && pos.bottom > ev.clientY) {
                        tarLi = item02;
                    }
                })
                //更新DOM ，即将选中的li删除
                aDragLi.forEach(function (item03, index03, arr03) {
                    oFilesUl.removeChild(item03);
                })
                //跟新数据的pid
                var dragData = []
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < aDragLi.length; j++) {
                        if (data[i].id == aDragLi[j].id) {
                            dragData.push(data[i])
                        }
                    }
                }
                dragData.forEach(function (item05) {
                    item05.pId = tarLi.id;
                })
            }
        })
        //判断父节点是否包含子节点,如果包含则删除节点
        var beContains = contains(oFilesUl, aDragCloneLi[0])
        if (beContains) {
            aDragCloneLi.forEach(function (item) {
                oFilesUl.removeChild(item);
            })
        }
        document.removeEventListener('mousemove', dragCloneLiMove)
        document.removeEventListener('mouseup', arguments.callee)
    }, false)


    //临时出现的li移动函数
    function dragCloneLiMove(ev) {
        ev.preventDefault();
        var mouseNowX = ev.clientX;
        var mouseNowY = ev.clientY;
        var distenceX = mouseNowX - mouseX;
        var distenceY = mouseNowY - mouseY;

        for (var i = 0; i < aDragCloneLi.length; i++) {
            aDragCloneLi[i].nowPosLeft = aDragLi[i].pos.left - iFilesUlX + distenceX;
            aDragCloneLi[i].nowPosTop = aDragLi[i].pos.top - iFilesUlY + distenceY;
            if (aDragCloneLi[i].nowPosLeft < 0) {
                aDragCloneLi[i].nowPosLeft = 0;
            }
            if (aDragCloneLi[i].nowPosTop < 0) {
                aDragCloneLi[i].nowPosTop = 0;
            }
            aDragCloneLi[i].style.left = aDragCloneLi[i].nowPosLeft + 'px';
            aDragCloneLi[i].style.top = aDragCloneLi[i].nowPosTop + 'px';
            oFilesUl.appendChild(aDragCloneLi[i]);
        }
        //当移动时，碰触到目标Li时，目标li显示蓝色边框
        for (var i = 0; i < aNoDragLi.length; i++) {
            aNoDragLi[i].children[0].style.border = '2px solid #fff';
            if (aNoDragLi[i].pos.left < mouseNowX && aNoDragLi[i].pos.right > mouseNowX && aNoDragLi[i].pos.top < mouseNowY && aNoDragLi[i].pos.bottom > mouseNowY) {
                aNoDragLi[i].children[0].style.border = '2px solid blue';
            }
        }
    }
}

/*************************按照日期排序**********************************************************/
var oSortDate = document.getElementsByClassName('sortDate')[0];
oSortDate.onclick = function () {
    var pId = location.hash.split('=')[1];
    oFilesUl.innerHTML = '';
    var aData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pId == pId) {
            aData.push(data[i]);
        }
    }
    aData.sort(function (a, b) {
        var date01 = new Date(a.date);
        var date02 = new Date(b.date);
        return date01 - date02;
    })
    for (var i = 0; i < aData.length; i++) {
        var oLi = rendDom(aData[i]);
        oFilesUl.appendChild(oLi);
    }

}


/*************************模拟滚动条  滚动条的高度更具内容高动态变化*********************************/
var oScrollBar = document.getElementById('scrollBox');
scrollBar();
/*滚动函数  1.判断是否出现滚动条
          2.在ul上绑定滚动函数（兼容绑定）。并确定在滚动条出现的时候触发
* */
function scrollBar() {
    //通过ul与其父级的高度大小判断是否出现滚动条，故先取到ul的高度
    try {
        var iTop = aFilesLi[aFilesLi.length - 1].offsetTop + aFilesLi[0].offsetHeight;
    } catch (e) {
        var iTop = 0;
    }
    oFilesUl.style.height = iTop + 'px';
    var iUlHei = parseFloat(getComputedStyle(oFilesUl).height);
    var iFilesBarHei = parseFloat(getComputedStyle(oFilesBar).height);
    var scale = iFilesBarHei / iUlHei;
    if (iUlHei > iFilesBarHei) {
        oScrollBar.style.display = 'block';
        oScrollBar.style.height = iFilesBarHei * scale + 'px';
        //出现滚动条，则绑定滚动事件
        oFilesUl.onmousewheel = function (ev) {
            if (oScrollBar.style.display == 'block') {
                mosueWheel(ev);
            }
        }
        oFilesUl.addEventListener('DOMMouseScroll', function (ev) {
            mosueWheel(ev);
        }, false)

    }else{
        oScrollBar.style.display = 'none';
    }
}
//滚动条的点击拖动事件
oScrollBar.onmousedown = function (ev) {
    ev.preventDefault();
    ev.cancelBubble = true;
    var iOldY = ev.clientY;
    var iOldTop = parseFloat(getComputedStyle(oScrollBar).top);
    document.addEventListener('mousemove', scrollDrag, false);
    function scrollDrag(ev) {
        ev.preventDefault();
        var iNowY = ev.clientY;
        var iDistenceY = iNowY - iOldY;
        oScrollBar.style.top = iOldTop + iDistenceY + 'px';
        if (parseFloat(getComputedStyle(oScrollBar).top) > parseFloat(getComputedStyle(oFilesBar).height) - parseFloat(getComputedStyle(oScrollBar).height)) {
            oScrollBar.style.top = parseFloat(getComputedStyle(oFilesBar).height) - parseFloat(getComputedStyle(oScrollBar).height) + 'px';
        }
        if (parseFloat(getComputedStyle(oScrollBar).top) < 0) {
            oScrollBar.style.top = 0;
        }
        var scale = parseFloat(getComputedStyle(oScrollBar).top) / (parseFloat(getComputedStyle(oFilesBar).height) - parseFloat(getComputedStyle(oScrollBar).height));
        console.log(scale)
        oFilesUl.style.top = -(parseFloat(getComputedStyle(oFilesUl).height) - parseFloat(getComputedStyle(oFilesBar).height)) * scale + 'px';

    }

    document.onmouseup = function () {
        document.removeEventListener('mousemove', scrollDrag);
        document.onmouseup = null;

    }
}


/***********************************改变排列布局方式****************************************/
var oBtnBarRight = document.getElementById('btnBarRight');
var oBtnDiv = oBtnBarRight.getElementsByTagName('div')[1];
var oBtnLine = oBtnBarRight.getElementsByTagName('div')[0];
oBtnDiv.onclick = function () {
    //每次新建都要将ul拉回顶部
    oFilesUl.style.top = 0 + 'px';
    oScrollBar.style.top = 0 + 'px';
    beLine = false;
    oBtnDiv.className = 'boxDiv';
    oBtnLine.className = 'lineDiv';
    rendBoxDiv();
    scrollBar();
}
function rendBoxDiv() {
    for(var i=0;i<aFilesLi.length;i++){
        aFilesLi[i].style.cssText = '';
        aFilesLi[i].children[0].style.cssText = '';
        aFilesLi[i].children[0].children[0].style.cssText = '';
        aFilesLi[i].children[1].style.cssText = '';
        var oDivSon = aFilesLi[i].getElementsByTagName('div')[1];
        if(oDivSon.className == 'icon2-changeLine'){
            oDivSon.className = 'icon2-change';
            oDivSon.parentNode.style.border = '2px solid blue';
        }
    }
}
oBtnLine.onclick = function () {
    //每次新建都要将ul拉回顶部
    oFilesUl.style.top = 0 + 'px';
    oScrollBar.style.top = 0 + 'px';
    beLine = true;
    oBtnDiv.className = 'boxDiv2';
    oBtnLine.className = 'lineDiv2';
    rendLineDiv();
    scrollBar();
};
function rendLineDiv() {
    console.log(aFilesLi)
    for(var i=0;i<aFilesLi.length;i++){
        aFilesLi[i].style.cssText = 'padding-left: 30px;width: 100%;height: 50px;border-bottom:1px solid #eee';
        aFilesLi[i].children[0].style.cssText = 'border:none;background-position:0 8px;background-size:30px 31px;height: 50px;width: 30px;float: left;';
        aFilesLi[i].children[0].children[0].style.cssText = 'margin-left: -18px;margin-top:14px';
        aFilesLi[i].children[1].style.cssText = 'display: inline-block;line-height:50px;height:50px;text-align:left;margin-left:8px;';
        var oDivSon = aFilesLi[i].getElementsByTagName('div')[1];
        if(oDivSon.className == 'icon2-change'){
            oDivSon.className = 'icon2-changeLine';
        }
    }
}

/***********************工具区*******************************************************************************************/
//判断父节点是否包含子节点函数
function contains(a, b) {
    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(arg) & 16);
}
//判断鼠标滚轮事件
function mosueWheel(ev) {
    var iUlTop = parseFloat(getComputedStyle(oFilesUl).top);
    var iUlHei = parseFloat(getComputedStyle(oFilesUl).height);
    var iFilesBarHei = parseFloat(getComputedStyle(oFilesBar).height);
    var scale = Math.abs(iUlTop) / (iUlHei - iFilesBarHei);
    var iScrollBar = iFilesBarHei - parseFloat(getComputedStyle(oScrollBar).height); //该值为负数
    var iTop = 0;
    var beUp = null;
    if (ev.wheelDelta) {
        beUp = ev.wheelDelta > 0 ? true : false; //ie/chrome
    } else {
        beUp = ev.detail < 0 ? true : false; //ff
    }
    //向上滚动
    if (beUp) {
        iTop = 10;
        if (iUlTop + iTop > 0) {
            iUlTop = -iTop;
        }
        oFilesUl.style.top = iUlTop + iTop + 'px';
        oScrollBar.style.top = iScrollBar * scale + 'px';

    } else {
        //向下滚动
        iTop = -10;
        if (Math.abs(iUlTop + iTop) > iUlHei - iFilesBarHei) {
            iUlTop = iFilesBarHei - iUlHei - iTop;
        }
        oFilesUl.style.top = iUlTop + iTop + 'px';
        oScrollBar.style.top = iScrollBar * scale + 'px';
    }
}
//鼠标移出li事件
function fnMouseOut(divIco) {
    if (divIco.className == 'icon2') { //在移除时判断 是否li被选中
        divIco.parentNode.style.border = 'none';
        divIco.style.display = 'none';
    }
    /*if(divIco.className == 'icon2-changeLine'){
        divIco.parentNode.parentNode.style.cssText = 'padding-left: 30px; width: 100%; height: 50px; border-bottom: 1px solid rgb(238, 238, 238); background-color: rgba(140, 137, 182, 0.560784);';
    }*/
};