const body = document.getElementsByTagName("body");

const searchType = document.getElementById("searchType");
const searchBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("search");

const table = document.getElementById("table");
const tableBody = document.getElementById("tbody");
const tableRows = tableBody.children;
const paginationBtnWrap = document.getElementById("buttonsWrap");

let currentPage = 1; 
const pagePerRow = 7;

if(searchBtn){
    searchBtn.addEventListener("click",()=>{
        const type = searchType.value.toLowerCase();
        const searchValue = searchInput.value
        location.href = `/books/search/${type}/${searchValue}`;
    })
}


function displayTableRows(wholeRows,page,row_per_page){

    for(let i = 0; i < wholeRows.length; i ++){
        wholeRows[i].style.display = "none";
    };

    page--;

    const showStart =  page * row_per_page; 
    const showEnd = showStart + row_per_page;
    const array = Object.values(wholeRows);
    const paginated = array.slice(showStart,showEnd);

    for(let i = 0; i < paginated.length; i ++){
        paginated[i].style.display = "";
    }
}

function createPaginateButtons(rows,row_per_page){
    const page_count = Math.ceil(rows.length / row_per_page)

    for(let i = 1; i < page_count + 1; i ++){
        const btn = paginateButton(i,rows);
        paginationBtnWrap.appendChild(btn);
    }
}


function paginateButton(page,rows){
    const button = document.createElement("button");
    button.textContent = page;

    if(currentPage === page){
        button.classList.add("active");
    }

    button.addEventListener("click",(e)=>{
        currentPage = page;

        displayTableRows(rows,page,pagePerRow);

        const activeBtn = paginationBtnWrap.querySelector(".active");
        activeBtn.classList.remove("active");
        button.classList.add("active");
    })

    return button;
}

displayTableRows(tableRows,currentPage,pagePerRow);

createPaginateButtons(tableRows,pagePerRow);









