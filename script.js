window.addEventListener("DOMContentLoaded", () => {
    const blockContainer = document.getElementById('blocks');
    const restartButton = document.getElementById('restartButton');
    const toggleButton = document.getElementById('toggleButton');
    const blockSize = 19;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const numCols = Math.ceil(screenWidth / blockSize);
    const numRows = Math.ceil(screenHeight / blockSize);
    const numBlocks = numCols * numRows;
    let snake = [Math.floor(numBlocks / 2)];
    let food = getRandomEmptyBlock();
    const maxSnakeSize = 20;
    let intervalId;
    let isRunning = true;

    function createBlocks() {
        for (let i = 0; i < numBlocks; i++) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.dataset.index = i;
            block.addEventListener("mousemove", highlightRandomNeighbors);
            blockContainer.appendChild(block);
        }
        placeFood();
    }

    function getRandomEmptyBlock() {
        let emptyBlocks = Array.from({ length: numBlocks }, (_, i) => i).filter(i => !snake.includes(i));
        return emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    }

    function moveSnake() {
        const head = snake[0];
        let newHead;

        const headRow = Math.floor(head / numCols);
        const headCol = head % numCols;
        const foodRow = Math.floor(food / numCols);
        const foodCol = food % numCols;

        if (headRow < foodRow) {
            newHead = (head + numCols) % numBlocks;
        } else if (headRow > foodRow) {
            newHead = (head - numCols + numBlocks) % numBlocks;
        } else if (headCol < foodCol) {
            newHead = (head + 1) % numBlocks;
            if (headCol === numCols - 1) newHead -= numCols;
        } else {
            newHead = (head - 1 + numBlocks) % numBlocks;
            if (headCol === 0) newHead += numCols;
        }

        if (snake.includes(newHead)) {
            resetSnake();
        } else {
            snake.unshift(newHead);

            if (newHead === food) {
                food = getRandomEmptyBlock();
                placeFood();
            } else {
                if (snake.length > maxSnakeSize) {
                    resetSnake();
                } else {
                    const tail = snake.pop();
                    blockContainer.children[tail].classList.remove('snake');
                }
            }

            updateSnake();
        }
    }

    function resetSnake() {
        snake = [Math.floor(numBlocks / 2)];
        food = getRandomEmptyBlock();
        placeFood();
        updateSnake();
    }

    function placeFood() {
        Array.from(blockContainer.children).forEach(block => block.classList.remove('food'));
        blockContainer.children[food].classList.add('food');
    }

    function updateSnake() {
        for (let i = 0; i < numBlocks; i++) {
            blockContainer.children[i].classList.remove('snake');
        }
        snake.forEach(index => {
            blockContainer.children[index].classList.add('snake');
        });
    }

    function highlightRandomNeighbors() {
        const index = parseInt(this.dataset.index);
        const neighbors = [
            index - 1,
            index + 1,
            index - numCols,
            index + numCols,
            index - numCols - 1,
            index - numCols + 1,
            index + numCols - 1,
            index + numCols + 1
        ].filter(
            (i) =>
            i >= 0 &&
            i < numBlocks &&
            Math.abs((i % numCols) - (index % numCols)) <= 1
        );

        this.classList.add("highlight");

        setTimeout(() => {
            this.classList.remove("highlight");
        }, 500);

        shuffleArray(neighbors)
            .slice(0, 1)
            .forEach((nIndex) => {
                const neighbor = blockContainer.children[nIndex];
                if (neighbor) {
                    neighbor.classList.add('highlight');
                    setTimeout(() => {
                        neighbor.classList.remove('highlight');
                    }, 500);
                }
            });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function start() {
        intervalId = setInterval(moveSnake, 200);
    }

    function stop() {
        clearInterval(intervalId);
    }

    restartButton.addEventListener('click', () => {
        resetSnake();
        if (!isRunning) {
            start();
            toggleButton.textContent = "Stop";
            isRunning = true;
        }
    });

    toggleButton.addEventListener('click', () => {
        if (isRunning) {
            stop();
            toggleButton.textContent = "Resume";
        } else {
            start();
            toggleButton.textContent = "Stop";
        }
        isRunning = !isRunning;
    });
    
    createBlocks();
    start();
});
