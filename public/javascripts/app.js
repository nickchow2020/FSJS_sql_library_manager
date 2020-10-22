const body = document.getElementsByTagName("body");  // get body tag

const searchType = document.getElementById("searchType"); //get select tag 
const searchBtn = document.getElementById("submitBtn"); // get search button 
const searchInput = document.getElementById("search"); // get search input 

const table = document.getElementById("table"); // get table element 
const tableBody = document.getElementById("tbody"); // get table body element 
const tableRows = tableBody.children; // store all the books list 
const paginationBtnWrap = document.getElementById("buttonsWrap"); // store the div that wrap paginate buttons 

let currentPage = 1;  // set current to 1 
const pagePerRow = 7; // row per page 

if(searchBtn){  // click on search button lead to search route on click 
    searchBtn.addEventListener("click",()=>{
        const type = searchType.value.toLowerCase(); //lower all the search genre
        const searchValue = searchInput.value // get search value 
        location.href = `/books/search/${type}/${searchValue}`; // points to search route 
    })
}


// function going to display the rows of 7
function displayTableRows(wholeRows,page,row_per_page){

    for(let i = 0; i < wholeRows.length; i ++){
        wholeRows[i].style.display = "none";
    }; // hide all reginal list 

    page--; // minus one to current page 

    const showStart =  page * row_per_page; // set start points
    const showEnd = showStart + row_per_page; // set end poinst 
    const array = Object.values(wholeRows); // convert whole books list to array 
    const paginated = array.slice(showStart,showEnd); // get 7 rows to display 

    for(let i = 0; i < paginated.length; i ++){
        paginated[i].style.display = ""; //show 7 rows 
    }
}

// function going to create pagination buttons 
function createPaginateButtons(rows,row_per_page){
    // set buttons with Math.ceil
    const page_count = Math.ceil(rows.length / row_per_page)

    // pass the button number to function of create buttons
    for(let i = 1; i < page_count + 1; i ++){
        const btn = paginateButton(i,rows);
        paginationBtnWrap.appendChild(btn);
    }

}

// create pagination buttons 
function paginateButton(page,rows){
    const button = document.createElement("button");
    button.textContent = page;

    if(currentPage === page){ // add active class
        button.classList.add("active");
    }

    button.addEventListener("click",(e)=>{
        currentPage = page;

        displayTableRows(rows,page,pagePerRow); // show the desire 7 rows 

        const activeBtn = paginationBtnWrap.querySelector(".active"); 
        activeBtn.classList.remove("active"); // remove previous active class 
        button.classList.add("active"); // add current active class
    })

    return button; // return button
}


displayTableRows(tableRows,currentPage,pagePerRow); // call function 
createPaginateButtons(tableRows,pagePerRow); // call function












