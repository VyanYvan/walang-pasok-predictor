# How to explain our system (cheat sheet)

## The one-liner
"It's an expert system that tells you if there's walang pasok in each NCR city, using DepEd's real rules, and guesses when it's up to the mayor."

## The 5 representations, one line each

- **Frames (1-frames.js):** Every city is a card with slots, like `signal: 2`, `rain: "orange"`, `partOf: "NCR 1st District"`. The app fills in the weather slots.
- **Network (2-network.js):** Cities are dots, and a line connects two cities that touch. Each line has the border length in km. We use it to see if your neighbors already have no classes.
- **Logic (3-logic.js):** True/false statements like `hasStrongSignal(city)` = signal is 3 or more. The Logic tab shows facts like `signal(manila, 2).`
- **Rules (4-rules.js):** IF-THEN rules. R rules are official and give 100%. P rules add points. D rules turn points into an answer.
- **Procedure (5-procedure.js):** The `thinkAbout()` function. It follows the same steps every time, in order.

## Questions the teacher might ask

**Where did the rules come from?**
R1 to R6 come from DepEd Order 22 s. 2024, EO 66 s. 2012, and CHED. The P rules and points are our own guesses.

**Why is the max 95%?**
Because a guess is never official. Only the mayor can make it 100%.

**How does the "nearby city" part work?**
We add up how many km of the city's border touches cities with no classes, divide it by the total border, and multiply by 30. Example: San Juan has 11.4 km of border. Manila and QC (no classes) cover 7.1 km. 7.1 / 11.4 x 30 = 19 points.

**Why only count neighbors with OFFICIAL suspensions?**
So two cities can't keep raising each other's guesses back and forth forever.

**Why is Senior High different at Signal 2?**
DepEd's 2024 rule only goes up to Grade 10 at Signal 2, so for Senior High we guess (+50) instead of saying 100%.

**Where did the map come from?**
Real city boundaries from a 2023 dataset based on PSA/NAMRIA. We measured which cities touch from those shapes.

## Demo order (2 minutes)
1. Click **Signal No. 1**, set level to Kinder. Everything turns red (rule R3).
2. Change level to Grade 1-10. Now it's 40% "maybe" (P2 + P8).
3. Click **Yellow rain + Manila and QC announced**, then **Show network**. San Juan is 54% because its neighbors have no classes.
4. Open the **Rules** tab to show which rules were used.
