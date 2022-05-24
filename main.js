//모든데이터 console에 aticles에 있으므로 뽑아내자
let news = [];

//페이지네이션 관련 변수 선언
let page = 1;
let total_pages =0;
//버튼목록 가져오는함수 queryselectorAll
let menus = document.querySelectorAll(".menus button");

//각각의 메뉴에 아이템을 줄거다
menus.forEach(menu=> menu.addEventListener("click",(event)=>getNewsByTopic(event) ));

//클릭이벤트 주기
let searchButton = document.getElementById("search-button");

//let url 전역변수 선언 -> getNews()함수 불러올때 각 함수에 있는 url이 지역변수라서, getNews()함수가 url을 못불러옴
let url;

//코드리펙토링
//1. 각 함수에서 필요한 url을 만든다
//2. api호출 함수를 부른다
const getNews = async () => {

//에러핸들러
try{
    let header = new Headers({
        "x-api-key":"3wyvQBgZiENXgPAIGEnv8FjZbHlIM4LsStSvret3oBU",
    });
    //url에 query더하는 방법
    url.searchParams.set("page", page); //뒤 전달인자, 전역변수로 설정한 page를 넣을거다
    console.log("url은?", url);
    let response = await fetch(url, {headers:header}); //데이터보내는방식 ajax, http, fetch
    let data = await response.json();
    if(response.status == 200)
    {
        if(data.total_hits ==0)
        {
 
            throw new Error("검색된 결과값이 없습니다");
        }
        //total_page API호출하면 consol창에 보여줌(확인방법)
        console.log("받는데이터??",data);

        news = data.articles;
        total_pages = data.total_pages;
        page = data.page;
        console.log(news);
        render();
        pagenation();
    }
    else
    {
        throw new Error(data.message);
    }
    
}catch(error)
{
    console.log("잡힌 에러는",error.message);
    errorRender(error.message); 
}

//Headers() 자바스크립트에서 제공해주는 클래스
let header = new Headers({
    "x-api-key":"3wyvQBgZiENXgPAIGEnv8FjZbHlIM4LsStSvret3oBU",
});

let response = await fetch(url, {headers:header}); //데이터보내는방식 ajax, http, fetch
let data = await response.json();
news = data.articles;
render();
};


//APi 부르는 함수
//URL() 자바스크립트에서 제공해주는 클래스
const getLatesNews = async() => {
     url = new URL(
        'https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10'
        );
        getNews();

};

//검색버튼 누를시 데이터전달 함수
const getNewsBykeyword = async () =>{
    //1. 검색 키워드 읽어오기
    let keyword = document.getElementById("search-input").value;

    //2. url에 검색 키워드 붙이기
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
    //3. 헤더준비
    //4. url부르기
    //5. 데이터 가져오기
    //6. 데이터 보여주기

    
};

//카테고리별 검색
const getNewsByTopic = async (event) => {
   
    let topic = event.target.textContent.toLowerCase(); //toLowerCase문자 소문자로 변경
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
};

//arrayfunction 사용
const render = () =>{
    let newsHTML = "";
    newsHTML = news
    .map((item) => {
        return `<div class="row news">
    <div class="col-lg-4">
    <img class="news-img-size" src="${item.media}">
    </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div>
                ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`;
    }).join('');

    console.log(newsHTML);

    document.getElementById("news-board").innerHTML=newsHTML;
};
//에러메시지 출력
const errorRender = (message) => {
    //부트스트랩 components -> alert에서 가져옴 
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

//페이지네이션 함수
//기본스타일 부트스트랩에서 가져옴 -> components -> pagenamtion
const pagenation = () => {

    //li 태그를 담을 변수 선언
    let pagenationHTML = ``;

    //1. total_page 수 알아야함
    //2. 현재 내가 보고있는 페이지 알아야함

    //3. page group 알아야함 -> page에서 5로나눈값을 올림해서 알수있다
    let pageGroup = Math.ceil(page/5);

    //4. 마지막페이지
    let last = pageGroup * 5;

    //5. 첫번째페이지
    let first = last - 4;

    //6. first ~ last 페이지 출력
    pagenationHTML= `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveTopage(${page-1}>
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>`;
    for(let i =first; i<=last;i++)
    {
        //${i} 페이지수 전달(동적값)
        //${page ==i ? "active":""} 부트스트랩 -> 현재페이지 강조효과
        pagenationHTML += `<li class="page-item ${
            page ==i ? "active" : ""
        }"><a class="page-link" href="#" onclick="moveTopage(${i})">${i}</a></li>`;
    }
    //페이지네이션 >>다음으로 가는 버튼
    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next"onclick="moveTopage(${page+1}>
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`

    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

//page 이동함수
const moveTopage = (pageNum) => {
    //1. 이동하고 싶은 페이지를 알아야함
    page = pageNum;
    //console에서 page 전달 잘되는지확인
    console.log(page);

    //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해주자
    getNews(); 
};

//클릭이벤트 주기
searchButton.addEventListener("click",getNewsBykeyword);

getLatesNews();
