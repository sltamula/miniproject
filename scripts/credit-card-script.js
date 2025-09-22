function createButton(container, path, text) {
  const buttonLink = document.createElement('a');
  buttonLink.href = path || '#';
  buttonLink.textContent = text || 'Learn More';
  buttonLink.classList.add('button');

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'btn-wrapper';

  const newButtonDiv = document.createElement('div');
  newButtonDiv.className = 'btn';
  newButtonDiv.append(buttonLink);
  buttonDiv.append(newButtonDiv);
  container.append(buttonDiv);
}

function renderContent(details, contentDiv) {
  const picture = createOptimizedPicture(
    details.image._path,
    details.name,
    false,
    [{ width: '750' }]
  );

  const cardImageDiv = document.createElement('div');
  cardImageDiv.className = 'cards-card-image';
  cardImageDiv.append(picture);

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'cards-card-body';

  const heading = document.createElement('h3');
  heading.textContent = details.name;

  const description = document.createElement('div');
  description.innerHTML = details.description.html;

  const features = document.createElement('div');
  features.innerHTML = details.cardFeatures.html;

  const benefits = document.createElement('div');
  benefits.innerHTML = details.cardBenefits.html;

  cardBodyDiv.append(heading, description, features, benefits);
  contentDiv.append(cardImageDiv, cardBodyDiv);
}

export { createButton, renderContent };
