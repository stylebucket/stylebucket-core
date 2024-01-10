export function setupCounter
(
  element: HTMLButtonElement,
)
: void
{
  let counter = 0;

  function setCounter(count: number) {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  }

  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
