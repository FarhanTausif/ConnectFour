var playerRed="R";
var playerBrown="B";
var currPlayer=playerBrown;
var gameOver=false;
var board;
var rows=6;
var columns=7;
var currColumns;
const dropSound = new Audio('../assets/tile-drop.mp3');

window.onload=function(){
    setGame();
    playBGM();
}

function setGame(){
    board=[];
    currColumns=[5,5,5,5,5,5,5];
    
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            row.push(' ');

            let tile=document.createElement("div");
            tile.id=r.toString()+"-"+c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click",setPiece);
            document.getElementById("board").append(tile); 
        }
        board.push(row);

    }

}

function setPiece(){
    if(gameOver){
        return;
    }

    dropSound.play();

    let coords=this.id.split("-");
    let r=parseInt(coords[0]);
    let c=parseInt(coords[1]);

    r=currColumns[c];
    if(r<0)
        return;

    board[r][c]=currPlayer;
    let tile=document.getElementById(r.toString()+"-"+c.toString());
    if(currPlayer==playerRed){
        tile.classList.add("red-piece");
        currPlayer=playerBrown;
    }
    else{
        tile.classList.add("brown-piece");
        currPlayer=playerRed;
    }
    r--;
    currColumns[c]=r;

    checkWinner();

}

function checkWinner(){
    //horizontal checker

    for(let r=0;r<rows;r++)
        for(let c=0;c<columns-3;c++)
            if(board[r][c]!=' ')
                if(board[r][c]==board[r][c+1] && board[r][c+1]==board[r][c+2] && board[r][c+2]==board[r][c+3]){
                    setWinner(r,c);
                    return;
                }
                
    //vertical checker

    for(let c=0;c<columns;c++)
        for(let r=0;r<rows-3;r++)
            if(board[r][c]!=' ')
                if(board[r][c]==board[r+1][c] && board[r+1][c]==board[r+2][c] && board[r+2][c]==board[r+3][c]){
                    setWinner(r,c);
                    return;
                }

    //diagonal checker

    for(let r=0;r<rows-3;r++)
        for(let c=0;c<columns-3;c++)
            if(board[r][c]!=' ')
                if(board[r][c]==board[r+1][c+1] && board[r+1][c+1]==board[r+2][c+2] && board[r+2][c+2]==board[r+3][c+3]){
                    setWinner(r,c);
                    return;
                }
    
    //anti diagonal checker

    for(let r=3;r<rows;r++)
        for(let c=0;c<columns-3;c++)
            if(board[r][c]!=' ')
                if(board[r][c]==board[r-1][c+1] && board[r-1][c+1]==board[r-2][c+2] && board[r-2][c+2]==board[r-3][c+3]){
                    setWinner(r,c);
                    return;
                }
}

function setWinner(r,c){
    let winner=document.getElementById("winner")

    if(board[r][c]==playerRed)
        winner.innerText="Maroon Wins!";
    else if (board[r][c]==playerBrown)
        winner.innerText="Ash Wins!";
    else 
        winner.innerText="Draw!";

    gameOver=true;
    
    // Stop BGM
    if (typeof bgmAudio !== 'undefined') {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }

    // Play game over sound
    const gameOverSound = new Audio("../assets/game-over.mp3");
    gameOverSound.play();

    // Reload when sound ends
    gameOverSound.onended = () => {
        window.location.reload();
    };
}