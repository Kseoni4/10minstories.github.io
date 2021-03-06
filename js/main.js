/* Блок переменных и инициализации персонажей */

var v = "v.0.3b:3005"; // версия игры

//"флаг" начатой игры

var gameInProgress = false; //если равен true, то игра загружает сохранение. 

// Коэффициенты

var cP = 1.2; // Коэффициент производства
var cUpg = 3; // Коэффициент стоимости улучшения
var cSP = 2.5; // Коэффициент возрастания производства
var cUpgFirstCost = 1.3; // Коэффициент стоимости первичного улучшения

//переменные счетчиков

var meme = 0; //Мемы
var upgds = 0; //Прирост мем/cек
var pValue = 0; //Текущий прогресс
var n = 0; // Переменная для рассчёта "клика"
var winValue = 1000000; // Начальная итоговая сумма
var b = 0; //Текущий бонус
var lvl = 1; //Текущий уровень (по умолчанию 1)

//инициализация персонажей (глобальные объекты)

var Tasha = new memePerson("Tasha", 10, 2, 0, 1);
var Artem = new memePerson("Artem", 10, 1, 0, 2);
var Jane = new memePerson("Jane", 500, 25, 0, 3);
var Kolbas = new memePerson("Kolbas", 5000, 50, 0, 4);
var Basta = new memePerson("Basta", 30000, 100, 0, 5);

var Cali = new memePerson("Cali", 80000, 200, 0, 6);
var Viet = new memePerson("Viet", 150000, 500, 0, 7);
var Erni = new memePerson("Erni", 300000, 700, 0, 8);
var Vasay = new memePerson("Vasay", 500000, 900, 0, 9);
var Kita = new memePerson("Kita", 500001, 1000, 0, 10);

var Bipa = new memePerson("Bipa", 1000000, 2500, 0, 11);
var Kan = new memePerson("Kan", 5000000, 2800, 0, 12);
var Oleg = new memePerson("Oleg",15000000, 3000, 0, 13);
var Erilon = new memePerson("Erilon", 17000000, 3300, 0, 14);
var Keke = new memePerson("Keke", 50000000, 3800, 0, 15);

/* Блок конструктора объектов персонажей */

function memePerson(name, pC, mFP, upgCount, pN) {
	this.personCost = pC;
	this.memesFirstProd = mFP;
	this.memesUpgProd = this.memesFirstProd * cSP;
	this.upgCost = Math.round(this.personCost / cUpgFirstCost);;
	this.upgCount = upgCount;
	this.namePerson = name;
	this.personNum = pN;
	this.personIsBuy = false;
}

pList = { Tasha, Artem, Jane, Kolbas, Basta, 
Cali, Viet, Erni, Vasay, Kita, 
Bipa, Kan, Oleg, Erilon, Keke }; // Список персонажей

var personList = ""; //строка приобретённных  персонажей

// инициализация бонусов (глобальные объекты)

var mtng = new bonus('Meeting');
var jkCock = new bonus('Joke cock');
var jkAss = new bonus('Joke ass');
var plBotle = new bonus('Play bottle');
var drink = new bonus('Drink');
var lostFili = new bonus('Lost in Fili');
var prazka	= new bonus('Prazka');
var talkHS	= new bonus('Talk about Homestuck');
var GrebChannel = new bonus('Find way to Gribnoy Kanal');
var battle = new bonus('Versus Battle');

var bList = { mtng, jkCock, jkAss, 
plBotle, drink, lostFili, 
prazka, talkHS, GrebChannel, battle }; // Список бонусов

/* Блок конструктора бонусов */

function bonus(name){
	this.bonusNum = 0;
	this.bonusName = name;
	this.bonusEffencive = 1;
	this.bonusCost = 1;
	this.bonusIsBuy = false;
}

/* Блок игровых функций */

function memeClick(num) { // Обычное нажатие
	n = ((num * lvl) * ((Math.floor(upgds * b)/3) + (upgds/(2+lvl))));
	if (n <= 0) {n = 1};
	meme = meme + num * n;
	document.getElementById('memes').innerHTML = Math.floor(meme);
	chkMeme(meme);
	updateCall(meme);
}

function memeAutoClick(num) { // Автонажатие
	n = (num + Math.floor(num * b)) * lvl;
	meme = meme + n;
	document.getElementById('memes').innerHTML = Math.floor(meme);
	chkMeme(meme);
}

function nextLevel() { // Функция перехода на следующий уровень
	if (meme >= winValue) {
		gameInProgress = false;
		meme = 0;
		upgds = 0;
		b = 0;
		n = 0;
		personList='';
		lvl++;
		if (lvl <= 3) { document.getElementById('lvl'+ lvl).disabled = ''; }
		save();
		initLevel(lvl);
		initGame();
		initPersons();
		return true;
	}
}

// Инициирование уровня: присвоение соответствующего стиля полосы прогресса

function initLevel (lvl) {
	lv = lvl;
	switch (lv) 
	{		
		case 1: {
			$('.progress').css('background-color', "#3F3F3F");
			$('.progress-bar').css('background-color', "#0E3E5B");
			winValue = 1000000;
			break;
		}
		case 2: {
			$('.progress').css('background-color', "#0E3E5B");
			$('.progress-bar').css('background-color', "#0E5195");
			winValue = 50000000;
			break;
		}
		case 3: {
			$('.progress').css('background-color', "#0E5195");
			$('.progress-bar').css('background-color', "#0E62B8");
			winValue = 500000000;
			break;
		}	
	}
	if (lv >= 4)
	{
		$('.progress').css('background-color', "#0E5195");
		$('.progress-bar').css('background-color', "#0E62B8");
		winValue = winValue * 1.3;
	}
}

//Функции покупки персонажей

function buyPerson_(person) {
	buyPerson.call(person)
}

function buyPerson() {
	if (meme >= this.personCost) {
			upgds = upgds + this.memesFirstProd;
			meme = meme - this.personCost;
			personList = personList + " " + this.namePerson;
		document.getElementById('upg').innerHTML = this.memesFirstProd;
		document.getElementById('upgCost' + this.namePerson).innerHTML = "Update cost: " + this.upgCost;
		document.getElementById('upgB' + this.personNum).style.display = '';
		document.getElementById('upgB' + this.personNum).style.display = 'inline';
		document.getElementById('personList').innerHTML = personList;
		document.getElementById('buy' + this.namePerson).disabled = 'disabled';
		document.getElementById('imgPerson' + this.namePerson).style.WebkitFilter="grayscale(0%)";
		this.personIsBuy = true;
	}
}

//Функции покупки улучшений для персонажей.

function upgPerson_(person) {
	upgPerson.call(person);
		
	}

function upgPerson() {
	if (meme >= this.upgCost) {
		if(this.upgCount < 4) {
			if (this.upgCount == 0) {
				upgds = upgds + this.memesUpgProd; 
			}
			else {
				this.memesUpgProd = Math.floor(this.memesUpgProd * Math.pow(cP, this.upgCount)); 
				upgds = upgds + this.memesUpgProd; 
			}	
			meme = meme - this.upgCost;
			this.upgCount++;
			this.upgCost = Math.floor(this.upgCost * Math.pow(cUpg, this.upgCount));
			if (this.upgCount == 3) { 
				document.getElementById('upgB' + this.personNum).style.display = 'none',
				document.getElementById('upgCost' + this.namePerson).innerHTML = this.namePerson + " " + 'in final form!';
				document.getElementById('imgPerson' + this.namePerson).src="img/" + this.namePerson + "3.png"; 
				document.getElementById('buy' + this.namePerson).style.opacity = 1;
				return true;
			}
			document.getElementById('imgPerson' + this.namePerson).src="img/" + this.namePerson + (this.upgCount + 1) + ".png"; 
			document.getElementById('upgCost' + this.namePerson).innerHTML = "Upgrade cost: " + this.upgCost;
			if (this == undefined) {
				return false;
			}
		}
	}	
}

// Функция покупки бонусов

function buyBonus_(name){
	buyBonus.call(name)
}

function buyBonus(){
	if (meme >= this.bonusCost) {
		b = b + this.bonusEffencive;
		meme = meme - this.bonusCost;
		document.getElementById('buyBonus' + this.bonusNum).disabled = 'disabled';
		this.bonusIsBuy = true;
	}
}

/* Блок асинхронных событий */

// События раз в 50 мс.

function updateCall(meme){
	if (gameInProgress = true) {
		chkPers(meme),
		chkPersAvalible(meme),
		chkPrgrs(meme),
		chkPepe(meme),
		chkMeme(meme),
		chkLvl(meme);
	}
}

//Функция проверки "доступности" покупки героев

function chkPers(m) {
	if (m >= Keke.personCost && !Keke.personIsBuy) 
		{ document.getElementById('imgPersonKeke').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Keke.personCost && !Keke.personIsBuy) 
		{ document.getElementById('imgPersonKeke').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Jane.personCost && !Jane.personIsBuy) 
		{ document.getElementById('imgPersonJane').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Jane.personCost && !Jane.personIsBuy) 
		{ document.getElementById('imgPersonJane').style.WebkitFilter="grayscale(100%) blur(10px)"; }
	 	
	if (m >= Basta.personCost && !Basta.personIsBuy) 
		{ document.getElementById('imgPersonBasta').style.WebkitFilter="grayscale(100%) blur(0px)"; }
	if (m < Basta.personCost && !Basta.personIsBuy) 
		{ document.getElementById('imgPersonBasta').style.WebkitFilter="grayscale(100%) blur(10px)"; }
	
	if (m >= Cali.personCost && !Cali.personIsBuy) 
		{ document.getElementById('imgPersonCali').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Cali.personCost && !Cali.personIsBuy) 
		{ document.getElementById('imgPersonCali').style.WebkitFilter="grayscale(100%) blur(10px)"; }
	
	if (m >= Oleg.personCost && !Oleg.personIsBuy) 
		{ document.getElementById('imgPersonOleg').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Oleg.personCost && !Oleg.personIsBuy) 
		{ document.getElementById('imgPersonOleg').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Kan.personCost && !Kan.personIsBuy) 
		{ document.getElementById('imgPersonKan').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Kan.personCost && !Kan.personIsBuy) 
		{ document.getElementById('imgPersonKan').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Kolbas.personCost && !Kolbas.personIsBuy) 
		{ document.getElementById('imgPersonKolbas').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Kolbas.personCost && !Kolbas.personIsBuy) 
		{ document.getElementById('imgPersonKolbas').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Vasay.personCost && !Vasay.personIsBuy) 
		{ document.getElementById('imgPersonVasay').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Vasay.personCost && !Vasay.personIsBuy) 
		{ document.getElementById('imgPersonVasay').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Viet.personCost && !Viet.personIsBuy) 
		{ document.getElementById('imgPersonViet').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Viet.personCost && !Viet.personIsBuy) 
		{ document.getElementById('imgPersonViet').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Erni.personCost && !Erni.personIsBuy) 
		{ document.getElementById('imgPersonErni').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Erni.personCost && !Erni.personIsBuy) 
		{ document.getElementById('imgPersonErni').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Artem.personCost && !Artem.personIsBuy) 
		{ document.getElementById('imgPersonArtem').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Artem.personCost && !Artem.personIsBuy) 
		{ document.getElementById('imgPersonArtem').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Bipa.personCost && !Bipa.personIsBuy) 
		{ document.getElementById('imgPersonBipa').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Bipa.personCost && !Bipa.personIsBuy) 
		{ document.getElementById('imgPersonBipa').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Tasha.personCost && !Tasha.personIsBuy) 
		{ document.getElementById('imgPersonTasha').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Tasha.personCost && !Tasha.personIsBuy) 
		{ document.getElementById('imgPersonTasha').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Kita.personCost && !Kita.personIsBuy) 
		{ document.getElementById('imgPersonKita').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Kita.personCost && !Kita.personIsBuy) 
		{ document.getElementById('imgPersonKita').style.WebkitFilter="grayscale(100%) blur(10px)"; }

	if (m >= Erilon.personCost && !Erilon.personIsBuy) 
		{ document.getElementById('imgPersonErilon').style.WebkitFilter="grayscale(100%) blur(0px)"; } 
	if (m < Erilon.personCost && !Erilon.personIsBuy) 
		{ document.getElementById('imgPersonErilon').style.WebkitFilter="grayscale(100%) blur(10px)"; }
} 

function chkPersAvalible(m) {

	/* Level 1 */

	if (!Tasha.personIsBuy) {
	document.getElementById('upgCost' + Artem.namePerson).style.display='none';
	document.getElementById('imgPersonArtem').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Artem.namePerson).style.display='';
	document.getElementById('imgPersonArtem').style.display="";	
	}

	if (!Artem.personIsBuy) {
	document.getElementById('upgCost' + Jane.namePerson).style.display='none';
	document.getElementById('imgPersonJane').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Jane.namePerson).style.display='';
	document.getElementById('imgPersonJane').style.display="";	
	}

	if (!Jane.personIsBuy) {
	document.getElementById('upgCost' + Kolbas.namePerson).style.display='none';
	document.getElementById('imgPersonKolbas').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Kolbas.namePerson).style.display='';
	document.getElementById('imgPersonKolbas').style.display="";	
	}

	if (!Kolbas.personIsBuy) {
	document.getElementById('upgCost' + Basta.namePerson).style.display='none';
	document.getElementById('imgPersonBasta').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Basta.namePerson).style.display='';
	document.getElementById('imgPersonBasta').style.display="";	
	}

	/* Level 2 */

	if (!Cali.personIsBuy) {
	document.getElementById('upgCost' + Viet.namePerson).style.display='none';
	document.getElementById('imgPersonViet').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Viet.namePerson).style.display='';
	document.getElementById('imgPersonViet').style.display="";	
	}

	if (!Viet.personIsBuy) {
	document.getElementById('upgCost' + Erni.namePerson).style.display='none';
	document.getElementById('imgPersonErni').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Erni.namePerson).style.display='';
	document.getElementById('imgPersonErni').style.display="";	
	}

	if (!Erni.personIsBuy) {
	document.getElementById('upgCost' + Vasay.namePerson).style.display='none';
	document.getElementById('imgPersonVasay').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Vasay.namePerson).style.display='';
	document.getElementById('imgPersonVasay').style.display="";	
	}

	if (!Vasay.personIsBuy) {
	document.getElementById('upgCost' + Kita.namePerson).style.display='none';
	document.getElementById('imgPersonKita').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Kita.namePerson).style.display='';
	document.getElementById('imgPersonKita').style.display="";	
	}

	/* Level 3 */

	if (!Bipa.personIsBuy) {
	document.getElementById('upgCost' + Kan.namePerson).style.display='none';
	document.getElementById('imgPersonKan').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Kan.namePerson).style.display='';
	document.getElementById('imgPersonKan').style.display="";	
	}

	if (!Kan.personIsBuy) {
	document.getElementById('upgCost' + Oleg.namePerson).style.display='none';
	document.getElementById('imgPersonOleg').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Oleg.namePerson).style.display='';
	document.getElementById('imgPersonOleg').style.display="";	
	}
	if (!Oleg.personIsBuy) {
	document.getElementById('upgCost' + Erilon.namePerson).style.display='none';
	document.getElementById('imgPersonErilon').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Erilon.namePerson).style.display='';
	document.getElementById('imgPersonErilon').style.display="";	
	}

	if (!Erilon.personIsBuy) {
	document.getElementById('upgCost' + Keke.namePerson).style.display='none';
	document.getElementById('imgPersonKeke').style.display="none";
	}
	else
	{
	document.getElementById('upgCost' + Keke.namePerson).style.display='';
	document.getElementById('imgPersonKeke').style.display="";	
	}

}

//Функция рассчёта прогресс-бара

function chkPrgrs(m) {
	if (m => 0) {
		pValue = m,
		pValue = ((pValue / winValue) * 100)
		if (pValue <= 100 && m <= winValue){
			$(document).ready(function(){
				$('.progress-bar').css('width', pValue+'%').attr('aria-valuenow', pValue);
			});
			document.getElementById('prgs').innerHTML = Math.floor(m) + "/" + winValue;
		}
		if (pValue >= 100 ){	
			document.getElementById('prgs').innerHTML = winValue + "/" + winValue;
			$('.progress-bar').css('background-color', "#00ff00");
		}	
	}
}

//Функция проверки Пепе

function chkPepe(m) {
	if (m < 10) 
		{ document.getElementById('pepe').src="img/1.png" }
	if (m >= 10) 
		{ document.getElementById('pepe').src="img/2a.png" }
	if (m >= 100) 
		{ document.getElementById('pepe').src="img/2b.png" }
	if (m >= (winValue/12)) 
		{ document.getElementById('pepe').src="img/2.png" }
	if (m >= (winValue/10)) 
		{ document.getElementById('pepe').src="img/3.png" }
	if (m >= (winValue/7)) 
		{ document.getElementById('pepe').src="img/5.png" }	
	if (m >= (winValue/5)) 
		{ document.getElementById('pepe').src="img/4.png" }
	if (m >= (winValue/2)) 
		{ document.getElementById('pepe').src="img/6.png" }
	if (m >= winValue) 
		{ document.getElementById('pepe').src="img/7.png" }
}

//Округление числа

function chkMeme(m) {
	if (m >= 1000000 && m < 1000000000) 
		{ var d = m; m = Math.floor(m / 1000000); d = Math.floor((d % 1000000) / 100000); 
		document.getElementById('memes').innerHTML = m + "," + d + "M" };
	if (m >= 1000000000) 
		{ var d = m; m = Math.floor(m / 1000000000), d = Math.floor((d % 1000000000) / 10000000);
		document.getElementById('memes').innerHTML = m + "," + d + "B" };
}

function chkLvl(m) {
	if (m >= winValue) { document.getElementById('nxtLvl').disabled = '';
	document.getElementById('nxtLvl').style.display = ''; 
	}
	if (lvl >= 3) { document.getElementById('nxtLvl').innerHTML = "Next level"; }
}

//Функция действий раз в секунду.

window.setInterval(function(){
	if(gameInProgress = true){
		memeAutoClick(upgds),
		updateCall(meme),
		timeOut(meme, upgds)
	};
	document.getElementById('lvl').innerHTML = lvl;
	document.getElementById('upg').innerHTML = Math.round(upgds + (upgds * b)) * lvl;
	document.getElementById('bns').innerHTML = b.toFixed(3) + '%';
	if (upgds > 0){
		document.getElementById('countMeme').innerHTML = Math.round(((1*lvl) * ((upgds * b) + (upgds/2))));
	}
	else document.getElementById('countMeme').innerHTML = 1;
}, 1000);

//Таймер для отсчёта времени до получения финальной суммы

function timeOut(meme, upgds) {
	if (meme > 0 && upgds > 0){
		p = winValue - meme;
		sec_ = Math.floor(p / ((upgds + Math.floor(upgds * b))*lvl));
		if (sec_ > 0) { 
			hours = (sec_ / 3600);
			hours = parseInt(hours);
			min_= sec_ - (hours * 3600);
			min = parseInt(min_ / 60);
			sec = min_ - (min * 60);
			if (min > 60) { min = min / 60 }
			if (hours < 10) { hours = "0" + hours }
			if (min < 10) { min = "0" + min}
			if (sec < 10) { sec = "0" + sec}
			document.getElementById('timeleft').innerHTML = "Timeleft to max memes: " + hours + ":" + min + ":" + sec;
		} 	else { document.getElementById('timeleft').innerHTML = "Timeleft: " + "00" + ":" + "00" + ":" + "00" + " Over! Pepe is happy!"; }
	}
}

//Функция автосохранения каждые 10 секунд.

window.setInterval(function(){
	save();
	document.getElementById('autosave').style.display = "inline"
	document.getElementById('autosave').innerHTML = "autosave complete";
}, 10000);

//Функция замещения сообщения об успешном автосохранении

window.setInterval(function(){
	document.getElementById('autosave').style.display = "none"
	document.getElementById('autosave').innerHTML = "";
}, 11000);


/* Блок системных функций */

// Функция инициализации игры

function initGame() {				
	if (localStorage['check.gameVersion'] != v && localStorage['check.gameVersion'] != undefined) {
		if(confirm('Your savegame version is outdated. Please reset game state for avoid issues') == true){
			removeSave();
			location.reload();
		}
	}
	document.getElementById('ver').innerHTML = v;
	gameInProgress = (localStorage['check.gameInProgress'] == "true");
	if (!gameInProgress) {			// Если флаг уже начатой игры равен false, то загрузить начальные значения счетчиков.
		document.getElementById('upg').innerHTML = upgds,
		document.getElementById('memes').innerHTML = meme,
		document.getElementById('lvl').innerHTML = lvl,
		document.getElementById('nxtLvl').disabled = 'disabled',
		document.getElementById('personList').innerHTML = "";
		$(document).ready(function(){
			$('.progress-bar').attr('aria-valuemax', winValue);
		});
		updateCall();	
		initStyles();  // Инициализация стилей у картинок.	
		initBonus(); // Инициализация бонусов
		gameInProgress = true; 
	}
	if(!resumeGame()) {}
};

	function initPersons(){ //Инициализация характеристик персонажей
		/* Level 1 */
		Tasha.personNum = 1;
		Tasha.memesFirstProd = 2;
		Tasha.personCost = 10;
		perCost.call(Tasha);

		Artem.personNum = 2;
		Artem.memesFirstProd = 1;
		Artem.personCost = 10;
		perCost.call(Artem);

		Jane.personNum = 3;
		Jane.memesFirstProd = 25;
		Jane.personCost = 500;
		perCost.call(Jane);

		Kolbas.personNum = 4;
		Kolbas.memesFirstProd = 50;
		Kolbas.personCost = 5000;
		perCost.call(Kolbas);

		Basta.personNum = 5;
		Basta.memesFirstProd = 100;
		Basta.personCost = 30000;
		perCost.call(Basta);

		/* Level 2 */
		Cali.personNum = 6;
		Cali.memesFirstProd = 200;
		Cali.personCost = 80000;
		perCost.call(Cali);

		Viet.personNum = 7;
		Viet.memesFirstProd = 500;
		Viet.personCost = 150000;
		perCost.call(Viet);

		Erni.personNum = 8;
		Erni.memesFirstProd = 700;
		Erni.personCost = 300000;
		perCost.call(Erni);	

		Vasay.personNum = 9;
		Vasay.memesFirstProd = 900;
		Vasay.personCost = 500000;
		perCost.call(Vasay);

		Kita.personNum = 10;
		Kita.memesFirstProd = 1000;
		Kita.personCost = 500001;
		perCost.call(Kita);

		/* Level 3 */
		Bipa.personNum = 11;
		Bipa.memesFirstProd = 2500;
		Bipa.personCost = 1000000;
		perCost.call(Bipa);

		Kan.personNum = 12;
		Kan.memesFirstProd = 2800;
		Kan.personCost = 5000000;
		perCost.call(Kan);

		Oleg.personNum = 13;
		Oleg.memesFirstProd = 3000;
		Oleg.personCost = 15000000;
		perCost.call(Oleg);

		Erilon.personNum = 14;
		Erilon.memesFirstProd = 3300;
		Erilon.personCost = 17000000;
		perCost.call(Erilon);

		Keke.personNum = 15;
		Keke.memesFirstProd = 3800;
		Keke.personCost = 50000000;
		perCost.call(Keke);

		
}

function perCost() {
		this.upgCost = Math.round(this.personCost / cUpgFirstCost);
		this.personIsBuy = false;
		this.upgCount = 0;
		this.memesUpgProd = this.memesFirstProd * cSP;
		document.getElementById('buy' + this.namePerson).disabled = '';
		document.getElementById('buy' + this.namePerson).style.opacity = .65;
		document.getElementById('imgPerson' + this.namePerson).src="img/" + this.namePerson + (this.upgCount + 1) + ".png"; 
		document.getElementById('upgCost' + this.namePerson).innerHTML = "Сost: " + this.personCost; 	
		}

function initStyles() { //Инициализация стилей у картинок
	for (var i = 1; i <= 15; i++) {
		document.getElementById('upgB' + i).style.display = 'none';	
	}
	for (var i in pList) {
		document.getElementById('imgPerson' + i).style.WebkitFilter = "grayscale(100%) blur(10px)";
		document.getElementById('buy' + pList[i].namePerson).disabled = '';
		document.getElementById('buy' + pList[i].namePerson).style.opacity = .65;
		document.getElementById('imgPerson' + pList[i].namePerson).src="img/" + pList[i].namePerson + (pList[i].upgCount + 1) + ".png"; 
		document.getElementById('upgCost' + pList[i].namePerson).innerHTML = "Сost: " + pList[i].personCost; 
	}
	if (meme < winValue) {
	document.getElementById('nxtLvl').disabled = 'disabled';
	}
}

// Инициализация характеристик бонусов

function initBonus(){
	mtng.bonusNum = 1;
	mtng.bonusEffencive = 0.01;
	mtng.bonusCost = 300;
	bStyles.call(mtng);
	
	jkCock.bonusNum = 2;
	jkCock.bonusEffencive = 0.03;
	jkCock.bonusCost = 700;
	bStyles.call(jkCock);
	
	jkAss.bonusNum = 3;
	jkAss.bonusEffencive = 0.05;
	jkAss.bonusCost = 1500;
	bStyles.call(jkAss);
	
	plBotle.bonusNum = 4;
	plBotle.bonusEffencive = 0.055;
	plBotle.bonusCost = 3000;
	bStyles.call(plBotle);

	drink.bonusNum = 5;
	drink.bonusEffencive = 0.07;
	drink.bonusCost = 7000;
	bStyles.call(drink);

	lostFili.bonusNum = 6;
	lostFili.bonusEffencive = 0.9;
	lostFili.bonusCost = 10000;
	bStyles.call(lostFili);

	prazka.bonusNum = 7;
	prazka.bonusEffencive = 0.105;
	prazka.bonusCost = 15000;
	bStyles.call(prazka);

	talkHS.bonusNum = 8;
	talkHS.bonusEffencive = 0.15;
	talkHS.bonusCost = 30000;
	bStyles.call(talkHS);

	GrebChannel.bonusNum = 9;
	GrebChannel.bonusEffencive = 0.2;
	GrebChannel.bonusCost = 50000;
	bStyles.call(GrebChannel);

	battle.bonusNum = 10;
	battle.bonusEffencive = 0.3;
	battle.bonusCost = 100000;
	bStyles.call(battle);
}

function bStyles () {
	this.bonusIsBuy = false;
	document.getElementById('buyBonus' + this.bonusNum).disabled = '';
	document.getElementById('costEf' + this.bonusNum).innerHTML = "Cost: " + this.bonusCost; 
	document.getElementById('eF' + this.bonusNum).innerHTML = "+" + this.bonusEffencive;
} 

function resumeGame() {
	gameInProgress = (localStorage['check.gameInProgress'] == "true");
	if (!gameInProgress) { return false };
	load();
}

function save() { 
	var save = {
		// Версия игры
		v: v,
		// Счётчики
		meme: meme,
		upgds: upgds,
		b: b,
		lvl: lvl,
		n: n,
		// Персонажи
		Keke: Keke,
		Jane: Jane,
		Basta: Basta,
		Cali: Cali,
		Oleg: Oleg,
		Kan: Kan,
		Kolbas: Kolbas,
		Vasay: Vasay,
		Viet: Viet,
		Erni: Erni,
		Artem: Artem,
		Bipa: Bipa,
		Tasha: Tasha,
		Kita: Kita,
		Erilon: Erilon,
		// Бонусы
		mtng: mtng,
		jkCock: jkCock,
		jkAss: jkAss,
		plBotle: plBotle,
		drink: drink, 
		lostFili: lostFili, 
		prazka: prazka, 
		talkHS: talkHS, 
		GrebChannel: GrebChannel, 
		battle: battle,
		// Остальные значения
		personList: personList,
		pValue: pValue,
		winValue: winValue,
		pList: pList,
		bList: bList,
		//Остальные переменные сюда
		}

	localStorage.setItem('save', JSON.stringify(save));
	localStorage['check.gameInProgress'] = gameInProgress;
	localStorage['check.gameVersion'] = v;
};

function load() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	initStyles();
	initBonus();

	/* Загружаем значения счётчиков */
	
	if (typeof savegame.meme != "undefined") {
		meme = savegame.meme;
		document.getElementById('memes').innerHTML = meme
		}
	if (typeof savegame.upgds != "undefined") {
		upgds = savegame.upgds;
		document.getElementById('upg').innerHTML = upgds 
		}
	if (typeof savegame.b != "undefined") {
		b = savegame.b;
		}
	if (typeof savegame.lvl != "undefined") {
		lvl = savegame.lvl;
		loadLvls(lvl);
		}
	if (typeof savegame.n != "undefined"){
		n = savegame.n;
		}
	if (typeof savegame.pValue != "undefined") {
			pValue = savegame.pValue;
		$('.progress-bar').css('width', pValue+'%').attr('aria-valuenow', pValue);
		}
	if (typeof savegame.winValue != "undefined") {
			winValue = savegame.winValue;
		}
	if (typeof savegame.personList != "undefined") {
		personList = savegame.personList;
		document.getElementById('personList').innerHTML = personList;
		}	

	/* Загружаем персонажей */	

	/*for (let i in pList) {
		if (savegame.pList[i].personIsBuy != false) {
			loadPerson.call(savegame.pList[i]);
			pList[i] = savegame.pList[i];
		}
	}*/ 	
	
	/* Level 1 */
	if (savegame.Artem.personIsBuy != false) {
		Artem = savegame.Artem;
		loadPerson.call(Artem);
		}
	if (savegame.Keke.personIsBuy != false) {
		Keke = savegame.Keke;
		loadPerson.call(Keke);
		}
	if (savegame.Jane.personIsBuy != false) {
		Jane = savegame.Jane;
		loadPerson.call(Jane);
		}
	if (savegame.Basta.personIsBuy != false) {
		Basta = savegame.Basta;
		loadPerson.call(Basta);
		}
	if (savegame.Cali.personIsBuy != false) {
		Cali = savegame.Cali;
		loadPerson.call(Cali);
		}
	if (savegame.Oleg.personIsBuy != false) {
		Oleg = savegame.Oleg;
		loadPerson.call(Oleg);
		}

	/* Level 2 */
	if (savegame.Kan.personIsBuy != false) {
		Kan = savegame.Kan;
		loadPerson.call(Kan);
		}
	if (savegame.Kolbas.personIsBuy != false) {
		Kolbas = savegame.Kolbas;
		loadPerson.call(Kolbas);
		}
	if (savegame.Vasay.personIsBuy != false) {
		Vasay = savegame.Vasay;
		loadPerson.call(Vasay);
		}	
	if (savegame.Viet.personIsBuy != false) {
		Viet = savegame.Viet;
		loadPerson.call(Viet);
		}
	if (savegame.Erni.personIsBuy != false) {
		Erni = savegame.Erni;
		loadPerson.call(Erni);
		}	

	/* Level 3 */
	if (savegame.Bipa.personIsBuy != false) {
		Bipa = savegame.Bipa;
		loadPerson.call(Bipa);
		}
	if (savegame.Tasha.personIsBuy != false) {
		Tasha = savegame.Tasha;
		loadPerson.call(Tasha);
		}
	if (savegame.Kita.personIsBuy != false) {
		Kita = savegame.Kita;
		loadPerson.call(Kita);
		}
	if (savegame.Erilon.personIsBuy != false) {
		Erilon = savegame.Erilon;
		loadPerson.call(Erilon);
		}



	/* Загружаем бонусы */
	
	if (savegame.mtng.bonusIsBuy != false) {
		mtng = savegame.mtng;
		loadBonuses.call(mtng);
	}
	if (savegame.jkCock.bonusIsBuy != false) {
		jkCock = savegame.jkCock;
		loadBonuses.call(jkCock);
	}
	if (savegame.jkAss.bonusIsBuy != false) {
		jkAss = savegame.jkAss;
		loadBonuses.call(jkAss);
	}
	if (savegame.plBotle.bonusIsBuy != false) {
		plBotle = savegame.plBotle;
		loadBonuses.call(plBotle);
	}
	if (savegame.drink.bonusIsBuy != false) {
		drink = savegame.drink;
		loadBonuses.call(drink);
	}
	if (savegame.lostFili.bonusIsBuy != false) {
		lostFili = savegame.lostFili;
		loadBonuses.call(lostFili);
	}
	if (savegame.prazka.bonusIsBuy != false) {
		prazka = savegame.prazka;
		loadBonuses.call(prazka);
	}
	if (savegame.talkHS.bonusIsBuy != false) {
		talkHS = savegame.talkHS;
		loadBonuses.call(talkHS);
	}
	if (savegame.GrebChannel.bonusIsBuy != false) {
		GrebChannel = savegame.GrebChannel;
		loadBonuses.call(GrebChannel);
	}
	if (savegame.battle.bonusIsBuy != false) {
		battle = savegame.battle;
		loadBonuses.call(battle);
	}
}

function loadLvls (lvl) {
	for (var i = 1; i <= lvl; i++) {
		if (lvl <= 3) {	document.getElementById('lvl'+ i).disabled = ''; }
		initLevel(i);
		}
	}

function loadBonuses () {
	document.getElementById('buyBonus' + this.bonusNum).disabled = 'disabled';
	document.getElementById('costEf' + this.bonusNum).innerHTML = "Cost: " + this.bonusCost; 
	document.getElementById('eF' + this.bonusNum).innerHTML = "+" + this.bonusEffencive;
} 

function loadPerson(){
		document.getElementById('buy' + this.namePerson).disabled = 'disabled';
		document.getElementById('upgCost' + this.namePerson).innerHTML = "Upgrade cost: " + this.upgCost;
		document.getElementById('upgB' + this.personNum).style.display = 'inline';
		document.getElementById('imgPerson' + this.namePerson).style.WebkitFilter="grayscale(0%)";
		document.getElementById('imgPerson' + this.namePerson).src="img/" + this.namePerson + (this.upgCount + 1) + ".png"; 
			if (this.upgCount == 3) { 
			document.getElementById('upgB' + this.personNum).style.display = 'none',
			document.getElementById('imgPerson' + this.namePerson).src="img/" + this.namePerson + "3.png";
			document.getElementById('imgPerson' + this.namePerson).style.WebkitFilter="grayscale(0%)"; 
			document.getElementById('upgCost' + this.namePerson).innerHTML = this.namePerson + ' in final form!'; 
			document.getElementById('buy' + this.namePerson).style.opacity = 1;
			}
}	

function removeSave() {
	localStorage.removeItem("save");
	localStorage.removeItem('check.gameInProgress');
	localStorage['check.gameVersion'] = v;
	location.reload();
}
















/* ==================================================== */

/*
function buyUpg() {
	var upgCost = Math.floor(10 * Math.pow(1.5, upgds)); //релизация формулы экспоненциального роста стоимости апгрейда
	if (meme >= upgCost) {
		upgds = upgds + 1;
		meme = meme - upgCost;
		document.getElementById('upg').innerHTML = upgds;
		document.getElementById('memes').innerHTML = meme;
	};
	var nextCost = Math.floor(10 * Math.pow(1.5, upgds));
	document.getElementById('upgCost').innerHTML = nextCost;
};
*/

/*

function initPersons() {
	var Keke = new memePerson("Кеке");
	Keke.memesFirstProd = 1;
	Keke.personCost = 10;
	Keke.memesUpgProd = 20;
	Keke.upgCount = 0;
	Keke.upgCost = Math.floor(10 * Math.pow(1.1, Keke.upgCount));

	var Jane = new memePerson("Жане");
	Jane.memesFirstProd = 10;
	Jane.personCost = 20;

	var Basta = new memePerson("Баста");
	Basta.memesFirstProd = 15;

	var Kali = new memePerson("Калли");
	Kali.memesFirstProd = 25;

	var Oleg = new memePerson("Олег");
	Oleg.memesFirstProd = 50;

}
*/

/*
function upgKeke() {
	var upgClone = {};	
	for (var key in window.Keke) {
		upgClone[key] = Keke[key];
	}
	upgPerson.call(upgClone);

	if (!upgPerson()) {	upgPerson.call(window.Keke); }

}
*/

/*
function chngColor(m, u) {
	if (m < 50){
		yClr = yClr + m;
		if (yClr > 215 && zClr < 215) { yClr = 215, zClr = zClr + m }
		clr = 'rgb(' + xClr +',' + yClr + ',' + zClr +')';
		document.getElementById('memes').style.color = clr;
	}
	if (m > 50 && m <100){
		yClr = yClr + m;
		if (yClr > 215 && zClr < 215) { yClr = 215 }
		zClr = zClr + m,
		clr = 'rgb(' + xClr +',' + yClr + ',' + zClr +')';
		document.getElementById('memes').style.color = clr;
	}
}
*/


/* Персонаж Кеке */

/*
function personKeke(param) {
	switch (param)
	{
		case 'buy':
		return buyKeke();
		break;

		case 'upg':
		return upgKeke();
		break;
	}
	function buyKeke() {
		Keke.memesFirstProd = 1;
		Keke.personCost = 10;
		Keke.upgCost = 10;
		Keke.memesUpgProd = 5;

		if (meme >= Keke.personCost) {
			upgds = upgds + Keke.memesFirstProd;
			meme = meme - Keke.personCost;
			personList = personList + " " + Keke.namePerson;
		//Keke.upgCost = Math.floor(10 * Math.pow(1.1, Keke.upgCount));
		document.getElementById('upg').innerHTML = Keke.memesFirstProd;
		document.getElementById('upgCostKeke').innerHTML = "Update cost: " + Keke.upgCost;
		document.getElementById('upgB1').style.display = '',
		document.getElementById('upgB1').style.display = 'inline';
		document.getElementById('personList').innerHTML = personList;
		document.getElementById('buyKeke').disabled = 'disabled';
		document.getElementById('imgPersonKeke').style.WebkitFilter="grayscale(0%)";
		Keke.personIsBuy = true;
		}
	}
	function upgKeke() {
		if (upgPerson.call(Keke) == true && Keke.upgCount < 4) { 
		document.getElementById('upgCostKeke').innerHTML = "Upgrade cost: " + Keke.upgCost; 
		}
		if (Keke.upgCount == 3) { 
			document.getElementById('upgB1').style.display = 'none',
			document.getElementById('upgCostKeke').innerHTML = 'Keke in final form!';
			document.getElementById('buyKeke').style.opacity = 1;
		}
	}
}
*/

/* Персонаж Жане */
/*
function personJane(param) {
	switch (param)
	{
		case 'buy':
		return buyJane();
		break;

		case 'upg':
		return upgJane();
		break;
	}
	function buyJane() {
		Jane.memesFirstProd = 15;
		Jane.personCost = 50;
		Jane.upgCost = 25;
		Jane.memesUpgProd = 20;

		if (meme >= Jane.personCost) {
			upgds = upgds + Jane.memesFirstProd;
			meme = meme - Jane.personCost;
			personList = personList + " " + Jane.namePerson;
		//Jane.upgCost = Math.floor(10 * Math.pow(1.1, Jane.upgCount));
		document.getElementById('upg').innerHTML = Jane.memesFirstProd;
		document.getElementById('upgCostJane').innerHTML = "Upgrade cost: " + Jane.upgCost;
		document.getElementById('upgB2').style.display = 'inline';
		document.getElementById('personList').innerHTML = personList;
		document.getElementById('buyJane').disabled = 'disabled';
		document.getElementById('imgPersonJane').style.WebkitFilter="grayscale(0%)";
		Jane.personIsBuy = true;
		}
	}
	function upgJane() {
		if (upgPerson.call(Jane) == true && Jane.upgCount < 4) { 
			document.getElementById('upgCostJane').innerHTML = "Upgrade cost: " + Jane.upgCost;

		}
		if (Jane.upgCount == 3) { 
			document.getElementById('upgB2').style.display = 'none', 
			document.getElementById('upgCostJane').innerHTML = 'Jane in final form!';
			document.getElementById('buyJane').style.opacity = 1;			
		}
	}
}
*/
/* Персонаж Баста */
/*
function personBasta(param) {
	switch (param)
	{
		case 'buy':
		return buyBasta();
		break;

		case 'upg':
		return upgBasta();
		break;
	}
	function buyBasta() {
		Basta.memesFirstProd = 25;
		Basta.personCost = 300;
		Basta.upgCost = 400;
		Basta.memesUpgProd = 40;

		if (meme >= Basta.personCost) {
			upgds = upgds + Basta.memesFirstProd;
			meme = meme - Basta.personCost;
			personList = personList + " " + Basta.namePerson;
		//Basta.upgCost = Math.floor(10 * Math.pow(1.1, Basta.upgCount));
		document.getElementById('upg').innerHTML = Basta.memesFirstProd;
		document.getElementById('upgCostBasta').innerHTML = "Update cost: " + Basta.upgCost;
		document.getElementById('upgB3').style.display = '',
		document.getElementById('upgB3').style.display = 'inline';
		document.getElementById('personList').innerHTML = personList;
		document.getElementById('buyBasta').disabled = 'disabled';
		document.getElementById('imgPersonBasta').style.WebkitFilter="grayscale(0%)";
		Basta.personIsBuy = true;
		}
	}
	function upgBasta() {
		if (upgPerson.call(Basta) == true && Basta.upgCount < 4) { 
		document.getElementById('upgCostBasta').innerHTML = "Upgrade cost: " + Basta.upgCost; 
		}
		if (Basta.upgCount == 3) { 
			document.getElementById('upgB3').style.display = 'none',
			document.getElementById('imgPersonBasta').src="img/basta3.png"; 
			document.getElementById('upgCostBasta').innerHTML = 'Basta in final form!';
			document.getElementById('buyBasta').style.opacity = 1;			
		}
	}
}
*/
/* Персонаж Калли */
/*
function personKali(param) {
	switch (param)
	{
		case 'buy':
		return buyKali();
		break;

		case 'upg':
		return upgKali();
		break;
	}
	function buyKali() {
		Kali.memesFirstProd = 100;
		Kali.personCost = 3000;
		Kali.upgCost = 1000;
		Kali.memesUpgProd = 250;

		if (meme >= Kali.personCost) {
			upgds = upgds + Kali.memesFirstProd;
			meme = meme - Kali.personCost;
			personList = personList + " " + Kali.namePerson;
		//Kali.upgCost = Math.floor(10 * Math.pow(1.1, Kali.upgCount));
		document.getElementById('upg').innerHTML = Kali.memesFirstProd;
		document.getElementById('upgCostKali').innerHTML = "Update cost: " + Kali.upgCost;
		document.getElementById('upgB4').style.display = '',
		document.getElementById('upgB4').style.display = 'inline';
		document.getElementById('personList').innerHTML = personList;
		document.getElementById('buyKali').disabled = 'disabled';
		document.getElementById('imgPersonKali').style.WebkitFilter="grayscale(0%)";
		Kali.personIsBuy = true;
		}
	}
	function upgKali() {
		if (upgPerson.call(Kali) == true && Kali.upgCount < 4) {
		document.getElementById('imgPersonKali').src="img/kali" + Kali.upgCount + ".png";
		document.getElementById('upgCostKali').innerHTML = "Upgrade cost: " + Kali.upgCost; 
		}
		if (Kali.upgCount == 3) { 
			document.getElementById('upgB4').style.display = 'none',
			document.getElementById('upgCostKali').innerHTML = 'Kali in final form!';
			document.getElementById('buyKali').style.opacity = 1;
		}
	}
}
*/

/*document.getElementById('upgB1').style.display = 'none',
		document.getElementById('upgB2').style.display = 'none',
		document.getElementById('upgB3').style.display = 'none',
		document.getElementById('upgB4').style.display = 'none',
		document.getElementById('upgB5').style.display = 'none',*/
		/*document.getElementById('imgPersonKeke').style.WebkitFilter="grayscale(100%) blur(10px)";
		document.getElementById('imgPersonKeke').title="Cost: " + Keke.personCost;
		document.getElementById('imgPersonJane').style.WebkitFilter="grayscale(100%) blur(10px)";
		document.getElementById('imgPersonJane').title="Cost: " + Jane.personCost;
		document.getElementById('imgPersonBasta').style.WebkitFilter="grayscale(100%) blur(10px)";
		document.getElementById('imgPersonBasta').title="Cost: " + Basta.personCost;
		document.getElementById('imgPersonCali').style.WebkitFilter="grayscale(100%) blur(10px)";
		document.getElementById('imgPersonCali').title="Cost: " + Cali.personCost;
		document.getElementById('imgPersonOleg').style.WebkitFilter="grayscale(100%) blur(10px)";
		document.getElementById('imgPersonOleg').title="Cost: " + Oleg.personCost;*/