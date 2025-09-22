export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  const children = [...block.children];
  children.forEach(row => {
    const cfPath = children[0].querySelector('a')?.title;
    // getContentFragmentDetails(cfPath, block);
  });
  block.textContent = '';
  block.append(ul);
}
