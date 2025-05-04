Takes in a json file with the following format:
Quote: Ordered list of pairs of character and number. Character may have number 0, if so it is shown by default
Answers: Clue, then ordered list of pairs of character and number.

Convert quote to just alphabetical characters (all caps)
Convert answers to just alphabetical characters (all caps)
Go thru each, finding count for each letter
Alert user if a) quote has letters not found in answers and b) answers have letters not found in quote.

If true anagram, then generate Quote: String

Go thru each answer.
For each answer: Clue and Explanation
For each letter: generate a random number in range of Clue's length. Go forwards in clue string (looping back) until it finds a matching letter. Save that index to an array, and replace that character with a 0.
Save the string and array both to the json

{
"quote":{quote}
"answers":[
    "clue":{clue}, "explanation":{explanation}, "answer":{answer}, "indices":{indices},
]
}

WIP json: same as above, except with no "indices" section


When importing json to the display:
    Import the quote to the top grid. If alphabetical character, number is i+=1. If Whitespace, number is hidden and square is black. Otherwise, insert character, number is hidden and square is read-only.

    Import each question to the bottom grids. Create a grid with the right number of cells. For each cell: take in the solution from the answer string, and the number from the indices array. Insert Clue to a label, and explanation to a [?] button's alert.

    Cells have: Solution, Pair, Location.

Check answers:
    In general: changes font colour to red on cells where the value and solution do not match
    Check solution: checks every letter of the quote
    Check letter: checks the currently highlighted letter
    Check one answer: checks every letter of the current grid. If the current grid is the quote, it instead checks evey letter of the current cell's pair

    If check solution is done and everythign is correct, yay! "Explain" buttons become visible

    