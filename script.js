//Disable Context Menu
document.addEventListener('contextmenu', event => event.preventDefault());

var firstClick, rows, cols, mines, minePos, grid, canvas, cellsOpened, flags, flagLabel;

//Fetch and get things ready
function setup(){
    //Getting values from user
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    mines = parseInt(document.getElementById('mines').value);

    //Fetch Hud elements
    flagLabel = document.getElementById('flags');

    //Fetching and emptying the canvas
    canvas = document.getElementById('play-area');
    canvas.innerHTML = '';

    //Creating Array representative of minefield
    grid = new Array(rows * cols);

    firstClick = true;
    cellsOpened = 0;
    flags = 0;
}

//Generate table on screen
function genTable(){
    setup();

    let cellID = 0;    //assigns html ID to each cell

    //Start of the table
    var htm = '<table>';

    //Generating the rows of the table
    for(let i = 0; i < rows; ++i){
        htm += '<tr>';  //row starts

        //Creating each cell
        for (let j = 0; j < cols; ++j, ++cellID)
            htm += '<td class="cell" id="' + cellID + '" onclick="process(this)" oncontextmenu="flag(this)"></td>';
        
        htm += '</tr>'  //row ends
    }

    //End of the table
    htm += '</table>'

    //Created table is added to the canvas
    canvas.innerHTML += htm;
}

//Process the current click
function process(cell){
    //Check and generate the grid if this is the first click
    if (firstClick){
        genGrid(cell.id);
        firstClick = false;
    }

    openCell(cell);     //Open the cell

    //Clicked on mine
    if (grid[cell.id] == -1){
        alert('You Clicked on a mine, better luck next time!')
        window.location.reload();
    }

    //Game is completed successfully
    if (cellsOpened == rows*cols - mines){
        alert('Congratulations!!! You found all the mines')
        window.location.reload();
    }

    propagate(cell);    //Open cells around it
}

//Toggle flag status
function flag(cell){
    //Remove flag if it already exists
    if (cell.style.backgroundImage != ''){
        cell.style.backgroundImage = '';
        flagLabel.innerHTML = --flags;
    }

    //Add flag
    else{
        cell.style = 'background-image : url(./res/flag.png); background-size : contain;';
        flagLabel.innerHTML = ++flags;
    }
}

//Opens the given cell on screen
function openCell(cell){
    //No need to open if cell has been clicked already
    if (cell == null || cell.getAttribute('onclick') == '')
        return;

    //Open as a mine
    if (grid[cell.id] == -1)
        cell.style = 'background-image : url(./res/mine.png); background-size : contain;'

    //Open blank
    else if (grid[cell.id] == 0)
        cell.style = 'background-color:lightblue;'
    
    //Open with the number of surrounding mines
    else{
        cell.innerHTML = grid[cell.id];
        cell.style = 'background-color:lightblue;'
    }

    //Make sure the cell can't be clicked again
    cell.setAttribute('onclick', '');

    ++cellsOpened;
}

//Open surrounding cells if possible
function propagate(cell){
    if (cell == null)
        return;

    openCell(cell);

    let cellID = parseInt(cell.id);

    if (grid[cellID] == 0){
        //North
        if (document.getElementById(cellID-cols) != null &&
            document.getElementById(cellID-cols).getAttribute('onclick') != '' &&
            grid[cellID-cols] != -1 &&
            cellID >= cols)
                propagate( document.getElementById(cellID-cols) );

        //South
        if (document.getElementById(cellID+cols) != null &&
            document.getElementById(cellID+cols).getAttribute('onclick') != '' &&
            grid[cellID+cols] != -1 &&
            cellID < (rows-1) * cols)
                propagate( document.getElementById(cellID+cols) );

        //East
        if (document.getElementById(cellID+1) != null &&
            document.getElementById(cellID+1).getAttribute('onclick') != '' &&
            grid[cellID+1] != -1 &&
            (cellID+1) % cols != 0)
                propagate( document.getElementById(cellID+1) );
        
        //West
        if (document.getElementById(cellID-1) != null &&
            document.getElementById(cellID-1).getAttribute('onclick') != '' &&
            grid[cellID-1] != -1 &&
            cellID % cols != 0)
                propagate( document.getElementById(cellID-1) );
        
        //North East
        if (document.getElementById(cellID-cols+1) != null &&
            document.getElementById(cellID-cols+1).getAttribute('onclick') != '' &&
            grid[cellID-cols+1] != -1 &&
            cellID >= cols &&
            (cellID+1) % cols != 0)
                propagate( document.getElementById(cellID-cols+1) );
        
        //North West
        if (document.getElementById(cellID-cols-1) != null &&
            document.getElementById(cellID-cols-1).getAttribute('onclick') != '' &&
            grid[cellID-cols-1] != -1 &&
            cellID >= cols &&
            cellID % cols != 0)
                propagate( document.getElementById(cellID-cols-1) );
        
        //South East
        if (document.getElementById(cellID+cols+1) != null &&
            document.getElementById(cellID+cols+1).getAttribute('onclick') != '' &&
            grid[cellID+cols+1] != -1 &&
            cellID < (rows-1) * cols &&
            (cellID+1) % cols != 0)
                propagate( document.getElementById(cellID+cols+1) );
        
        if (document.getElementById(cellID+cols-1) != null &&
            document.getElementById(cellID+cols-1).getAttribute('onclick') != '' &&
            grid[cellID+cols-1] != -1 &&
            cellID < (rows-1) * cols &&
            cellID % cols != 0)
                propagate( document.getElementById(cellID+cols-1) );
    }
}

//Generate the minegrid
function genGrid(firstCell){
    //Get Random positions to place mines
    minePos = uniqueRandNums(mines, 0, (rows * cols) - 1);

    //If first click was on a mine, get positions again
    while(arrayContains(parseInt(firstCell), minePos))
        minePos = uniqueRandNums(mines, 0, (rows * cols) - 1);

    //Change the mine position values to -1
    for (let i = 0; i < mines; ++i)
        grid[minePos[i]] = -1;

    populateGrid();
}

//Generate n unique random numbers between a and b
function uniqueRandNums(n, a, b){
    //Array to store unique random numbers
    var res = new Array(n);

    for(let i = 0; i < n;){
        const rand = randIntBetween(a, b);

        //Check for duplicates
        if (arrayContains(rand, res))
            continue;
        
        //If no duplicate found, add to res
        res[i] = rand;
        ++i;
    }

    return res;
}

//Check if an array contains a given element
function arrayContains(x, arr){
    for(let i = 0; i < arr.length; ++i)
        if(arr[i] == x)
            return true;

    return false;
}

//Generate Random Integer between a and b, both inclusive
function randIntBetween(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

//Populate the grid with number of adjacent mines
function populateGrid(){
    for (let i = 0; i < rows * cols; ++i){
        //No need to find adjacent mines to a mine
        if (grid[i] == -1)
            continue;

        let adjMines = 0;   //Adjacent mines

        //Check North
        if (i >= cols && grid[i-cols] == -1)
            ++adjMines;

        //Check South
        if (i < (rows-1) * cols && grid[i+cols] == -1)
            ++adjMines;

        //Check East
        if ((i+1) % cols != 0 && grid[i+1] == -1)
            ++adjMines;

        //Check West
        if (i % cols != 0 && grid[i-1] == -1)
            ++adjMines;

        //Check North East
        if (i >= cols && (i+1) % cols != 0 && grid[i-cols+1] == -1)
            ++adjMines;

        //Check North West
        if (i >= cols && i % cols != 0 && grid[i-cols-1] == -1)
            ++adjMines;

        //Check South East
        if (i < (rows-1) * cols && (i+1) % cols != 0 && grid[i+cols+1] == -1)
            ++adjMines;

        //check South West
        if (i < (rows-1) * cols && i % cols != 0 && grid[i+cols-1] == -1)
            ++adjMines;

        grid[i] = adjMines;
    }
}

//Implement sleep functionality
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}