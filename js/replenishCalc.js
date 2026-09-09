let total = 0;
let currentNum = "0";
let totalNumList = 0;
let tempNumCalc = 0;
let ListArray = [];

function addList(){
    ListArray.push(currentNum);
    document.getElementById("listArray").innerText = ListArray;
    totalNumList++;
    document.getElementById("digitCountMessage").innerText = `${totalNumList} list entered.`
    document.getElementById("currentNumber").innerText = 0;
    tempNumCalc = total + Number(currentNum);
    total = tempNumCalc;
    currentNum = "0";
    if(total >= 100){
        document.getElementById("totalCount").style.color = "green";
    }
    document.getElementById("totalCount").innerText = `${total} items counted.`
}

function addNum(btnNum){
    if(currentNum === "0"){
        currentNum = btnNum.toString();
        document.getElementById("currentNumber").innerText = currentNum;
    }else {
        currentNum += btnNum.toString();
        document.getElementById("currentNumber").innerText = currentNum;
    }

}

function clearAll(){
    currentNum = "0";
    total = 0;
    totalNumList = 0;
    ListArray = [];
    document.getElementById("currentNumber").innerText = "0";
    document.getElementById("digitCountMessage").innerText = "0 list entered.";
    document.getElementById("totalCount").innerText = "0 items counted.";
    document.getElementById("listArray").innerText = "";
    document.getElementById("totalCount").style.color = "#ffffff";
}

function undo(){
    if (currentNum.length > 1) {
        currentNum = currentNum.slice(0, -1);
    }else {
        currentNum = "0";
    }
    
    document.getElementById("currentNumber").innerText = currentNum;
}