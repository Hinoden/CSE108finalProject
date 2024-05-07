import React, { useState, useEffect } from 'react';
import {useChannelStateContext, useChatContext} from 'stream-chat-react'
import Square from './Square'
import { Patterns } from './WinningComponents'
import "../Board.css";

function Board({result, setResult}){ 
    const [board, setBoard] = useState(["","","","","","","","",""]);
    const [player, setPlayer] = useState("X");
    const [turn, setTurn] = useState("X");

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    useEffect(() => {
        checkWin();
        checkTie();
    }, [board])
    
    const chooseSquare = async (square) => {//function takes in a square to determine what gets changed
        if (turn === player && board[square] === ""){
            setTurn(player === "X" ? "O" : "X"); //if turn is X, make it O, otherwise turn is X's
            
            await channel.sendEvent({
                type: "game-move",
                data: {square: square, player},
            });

            setBoard(board.map((val, idx) => { 
                if (idx === square && val === "") {
                    return player //return player because player is X/O
                }
                return val
            })
            ); 
        }
    }

    const checkWin = () => {
        Patterns.forEach((currPattern) => {
            const firstPlayer = board[currPattern[0]]
            if (firstPlayer === "") return
            let foundWinningPattern = true;
            currPattern.forEach((idx) => {
                if(board[idx] != firstPlayer){
                    foundWinningPattern = false;
                }
            });
            if (foundWinningPattern) {
                alert("Winner", board[currPattern[0]])
                setResult({winner: board[currPattern[0]], state: "won"});
            }
        })
    }

    const checkTie = () => {
        let filled = true;
        board.forEach((square) => {
            if (square === ""){
                filled = false;
            }
        })
        if (filled) {
            alert("Tie")
            setResult({winner: "none", state: "tie"});
        }
    }

    channel.on((event) => { 
        if(event.type === "game-move" && event.user.id !== client.userID) {
            const currentPlayer = event.data.player === "X" ? "O" : "X"; //If current player grabbed by event is "X", makes them "O", otherwise "X"
            setPlayer(currentPlayer);
            setTurn(currentPlayer);
            setBoard(board.map((val, idx) => { 
                if (idx === event.data.square && val === "") {
                    return event.data.player;
                }
                return val;
            })) 
        }
    })

    return(
        <div className = "board">
            <div className = "row">
                <Square 
                    chooseSquare={() => {
                        chooseSquare(0);
                    }}
                val={board[0]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(1);
                    }}
                val={board[1]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(2);
                    }}
                val={board[2]}
                />
            </div>
            <div className = "row">
            <Square 
                    chooseSquare={() => {
                        chooseSquare(7);
                    }}
                val={board[7]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(8);
                    }}
                val={board[8]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(3);
                    }}
                val={board[3]}
                />
            </div>
            <div className = "row">
            <Square 
                    chooseSquare={() => {
                        chooseSquare(6);
                    }}
                val={board[6]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(5);
                    }}
                val={board[5]}
                />
                <Square 
                    chooseSquare={() => {
                        chooseSquare(4);
                    }}
                val={board[4]}
                />
            </div>
        </div>
    )
}

export default Board
