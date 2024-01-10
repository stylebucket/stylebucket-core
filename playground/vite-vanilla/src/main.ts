import { setupCounter } from './counter';
import { classNames } from './main.style';

import './main.css';

const { heading } = classNames;

function vanillaApp() {

  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <div>
      <h1 class="${heading.name}">Vite + TypeScript</h1>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  `;

  const counter = document.querySelector<HTMLButtonElement>('#counter');
  if (counter) setupCounter(counter);
}

vanillaApp();
