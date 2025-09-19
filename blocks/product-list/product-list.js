export default async function decorate(block) {
  // You can add logic here to process the child blocks.
  // For example, you might add a class to each child.
  [...block.children].forEach(child => {
    child.classList.add('credit-card-product-container');
  });
}
