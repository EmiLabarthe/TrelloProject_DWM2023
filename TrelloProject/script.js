
let columnsList;
let cardCounter = 2;
let columnCounter = 5;
initialize();

/**
 * Agregar tarjeta, se manda como parámetro el ID del contenedor.
 * El contenedor es "cardContainer" y su número de columna.
 * @param {*} cardContainerID 
 */
function addCard(cardContainerID) {

  // User talk  
  let task = document.getElementById("taskPrompt"+ cardContainerID.substring(13)).value;
  let date = document.getElementById("deadlinePrompt"+ cardContainerID.substring(13)).value;

  if(date){
    date = new Date(date);
  }else{
    date = null;
  }

  // JSON gestiones
  columnsList.find((element) => element.id === cardContainerID).cards.push({
    id: "card"+cardCounter,
    content: task,
    deadline: date
  });

  drawCard(cardContainerID, "card"+cardCounter);
  
  cardCounter ++;
  save();
}

/**
 * Agregar columna
 */
function addColumn() {

  const columnTitle = document.getElementById("titlePrompt").value;

  // JSON gestiones
  columnsList.push({
    id: "cardContainer"+columnCounter,
    title: columnTitle,
    cards: []
  });

  drawColumn("cardContainer"+columnCounter)

  columnCounter ++;
  save();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev){
  ev.dataTransfer.setData("text", ev.target.innerHTML);
  ev.dataTransfer.setData("ID", ev.target.id);
}

function drop(ev, cardContainerID) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
    
  // Elimino la tarjeta de donde estaba 
  let oldCard;
  let keepContent;
  let keepDate;
  const oldID = ev.dataTransfer.getData("ID");
  const element = document.getElementById(oldID);  
  element.remove();
  for( let c of columnsList){   // Por columna en columnas
      oldCard = c.cards.find(element => element.id == oldID);
      c.cards = c.cards.filter(obj => obj.id !== oldID);
      if (oldCard)
        break;
  }
  if(oldCard){
    keepContent = oldCard.content;
    keepDate = oldCard.deadline;
  }
    

  // Creo la tarjeta en su nuevo lugar
  const column = document.getElementById(cardContainerID);
  const newDiv = document.createElement("div");
  newDiv.className = "card myCard";
  newDiv.id = oldID;
  newDiv.draggable = true;
  newDiv.innerHTML = data;
  newDiv.setAttribute("ondragstart", "drag(event)");
  column.appendChild(newDiv);

  columnsList.find((element) => element.id === cardContainerID).cards.push({
    id: oldID,
    content: keepContent,
    deadline: keepDate
  });
  
  save();
  cardCounter ++;
}

function deleteElement(elID){ // CARDS
  let q = confirm("Are you sure you want to delete this item?");
  if(q){
    const element = document.getElementById(elID);
    element.remove();
  }
  for( let c of columnsList){
    c.cards = c.cards.filter(obj => obj.id !== elID);
  }
  save();
}

function deleteColumn(elID){ // Column
  let q = confirm("Are you sure you want to delete this item?");
  if(q){
    const element = document.getElementById(elID);
    element.remove();
  }
  columnsList = columnsList.filter(obj => obj.id !== "cardContainer"+elID.substring(3));
  save();
}

function save(){
  localStorage.setItem("columnas",JSON.stringify(columnsList));
  localStorage.setItem("cardCounter", cardCounter);
  localStorage.setItem("columnCounter",columnCounter);
}

function initialize(){
  let storage = localStorage.getItem("columnas");
  columnsList = JSON.parse(storage);
  cardCounter = parseInt(localStorage.getItem("cardCounter"));
  columnCounter = parseInt(localStorage.getItem("columnCounter"));

  if(!cardCounter){
    cardCounter = 2;
  }
  if(!columnCounter){
    columnCounter = 5;
  }
  
  if(!columnsList){
    cardCounter = 2;
    columnCounter = 5;
    columnsList = [{
      id: "cardContainer1",
      title: "Backlog",
      cards: []
    },
    {
      id: "cardContainer2",
      title: "To Do",
      cards: []
    },
    {
      id: "cardContainer3",
      title: "Doing",
      cards: []
    },
    {
      id: "cardContainer4",
      title: "Done",
      cards: []
    }];
  }

  drawFromZero();
}


function drawFromZero(){
  for(let col of columnsList){
    drawColumn(col.id);
    for(let card of col.cards){
      drawCard(col.id, card.id);
    }
  }
}

function drawColumn(colID){
  // Dibujar un nuevo elemento div
  const container = document.getElementById("columnContainer");
  const col = columnsList.find((element) => element.id === colID) 
  const newDiv = document.createElement("div");
  newDiv.className = 'taskColumn col-lg-2';
  let idNum = colID.substring(13);
  newDiv.id = "col" + idNum;
  newDiv.innerHTML = `
    <div class="taskColumnTitle">
      <button class="deleteColumn" onclick="deleteColumn('col`+idNum+`')">
          X
        </button> 
      <h4 contenteditable="true">`+ col.title + `</h4>
    </div>
    <div class="dropZone" ondrop="drop(event, '`+col.id+`')" ondragover="allowDrop(event)">
      <p><img src="https://cdn-icons-png.flaticon.com/512/724/724933.png" class="dropZoneImg"/> drop here </p>
    </div>
    <div id="`+col.id+`"></div>
    
    <footer class="addCardButton">
    <button href="" 
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#modalCardContent`+idNum+`">
      + Add card
    </button>
  </footer>
    <div
      class="modal fade"
      id="modalCardContent`+idNum+`"
      tabindex="-1"
      aria-labelledby="modalCardContentLabel`+idNum+`"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title" id="modalCardContentLabel`+idNum+`">Creating new card</h5>
              Creating new card
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
          <label for="taskPrompt`+idNum+`">Write your task:</label>
          <input type="text" id="taskPrompt`+idNum+`" class="form-control myModalInput" />
          <label for="deadlinePrompt`+idNum+`">Write the deadline (YYYY-MM-DD):</label>
          <input type="date" id="deadlinePrompt`+idNum+`" class="form-control myModalInput" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
             onclick="addCard('cardContainer`+idNum+`')"
              data-bs-dismiss="modal"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  // Agregar el nuevo div al contenedor
  container.appendChild(newDiv);
}

function drawCard(cardContainerID, cardID){
  // Dibujar un nuevo elemento div
  const column = columnsList.find((element) => element.id === cardContainerID)
  const card = column.cards.find((element) => element.id === cardID) //"card"+cardCounter
  const container = document.getElementById(cardContainerID);
  const newDiv = document.createElement("div");
  newDiv.className = "card myCard";
  newDiv.id = cardID;
  newDiv.draggable = true;
  newDiv.setAttribute("ondragstart", "drag(event)");
  if(card.deadline != null){
    newDiv.innerHTML = `
    <div class="card-body">
      <button class="deleteElement" onclick="deleteElement('`+card.id+`')">
        X
      </button>
      <p contenteditable="true" class="card-text">` +card.content+ `</p>
      <p class="cardDeadline"><img src="https://www.pngarts.com/files/10/Vector-Clock-PNG-Free-Download.png" class="deadlineClock"/> `+card.deadline.toDateString()+`</p>
    </div>
  `;
  }else{
    newDiv.innerHTML = `
    <div class="card-body myCardBody">
      <button class="deleteElement" onclick="deleteElement('`+card.id+`')">
        X
      </button>
      <p contenteditable="true" class="card-text">` +card.content+ `</p>  
    </div>
  `;
  }
  
  // Agregar el nuevo div al contenedor
  container.appendChild(newDiv);

  document.getElementById("taskPrompt"+ cardContainerID.substring(13)).value = "";
  document.getElementById("deadlinePrompt"+ cardContainerID.substring(13)).value = "";

}