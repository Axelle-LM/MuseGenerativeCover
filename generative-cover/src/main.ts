import './style.css'

const c = document.getElementById('c') as HTMLCanvasElement;
const ctx = c.getContext('2d')!;
const squareSize = 400;
const dpr = window.devicePixelRatio;

c.width = squareSize * dpr;
c.height = squareSize * dpr;
ctx.scale(dpr, dpr);

const centerX = squareSize / 2;
const centerY = squareSize / 2;
const radius = squareSize / 2;
let hexSize = 15;
let hexVertDist = 10;
let hexHorDist = 10;
let petalCount = 12;
let vinylRotationAngle = 0;
let shadowRotationAngle = 0;
let logoRotationAngle = 0;

let angle = 0;
let textSize = 30;
let textColor = '#ffffff';
let strokeColor = '#000000';

const vinylImage = new Image();
vinylImage.src = '1.png';
vinylImage.onload = () => {
	loop();
};

const secondImage = new Image();
secondImage.src = '2.png';

function drawHexagon(x: number, y: number, size: number) {
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	for (let i = 0; i < 6; i++) {
		const angle = (Math.PI / 3) * i;
		const px = x + 5 * Math.cos(angle);
		const py = y + 7 * Math.sin(angle);
		if (i === 0) {
			ctx.moveTo(px, py);
		} else {
			ctx.lineTo(px, py);
		}
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawVinyl() {
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(vinylRotationAngle * (Math.PI / 180));

	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(0, 0, radius, 0, 2 * Math.PI);
	ctx.fill();

	let row = 0;
	const hexSizeAdjusted = hexSize * 1.2;
	for (let y = -radius - hexSizeAdjusted; y < radius + hexSizeAdjusted; y += hexVertDist) {
		for (let x = -radius - hexSizeAdjusted; x < radius + hexSizeAdjusted; x += hexHorDist) {
			const dx = x + (row % 2 === 0 ? 0 : hexHorDist / 2);
			const distToCenter = Math.sqrt(dx * dx + y * y);

			if (distToCenter + hexSizeAdjusted < radius) {
				const hue = (distToCenter / radius) * 740;

				const saturation = Math.min(100, 20 + (1 - distToCenter / radius) * 250);

				const lightness = Math.max(30, Math.min(50 + (1 - distToCenter / radius) * 100, 60));

				ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
				drawHexagon(dx, y, hexSizeAdjusted);
			} else if (distToCenter - hexSizeAdjusted < radius) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, 2 * Math.PI);
				ctx.clip();

				const hue = (distToCenter / radius) * 740;
				const saturation = Math.min(100, 40 + (1 - distToCenter / radius) * 250);
				const lightness = Math.max(30, Math.min(50 + (1 - distToCenter / radius) * 100, 60));

				ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
				drawHexagon(dx, y, hexSizeAdjusted);

				ctx.restore();
			}
		}
		row++;
	}

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(0, 0, hexSizeAdjusted * 3, 0, 2 * Math.PI);
	ctx.fill();

	if (showPetal) {
		ctx.strokeStyle = 'rgba(128, 128, 128, 1)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(0, 0, hexSizeAdjusted * 3, 0, 2 * Math.PI);
		ctx.stroke();
	}

	ctx.restore();
}

function drawImageOnVinyl() {
	ctx.save();
	ctx.translate(centerX, centerY);

	ctx.rotate(shadowRotationAngle * (Math.PI / 180));
	const imageSize = radius * 0.25;
	ctx.drawImage(vinylImage, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

	ctx.restore();
	ctx.save();
	ctx.translate(centerX, centerY);

	ctx.rotate(logoRotationAngle * (Math.PI / 180));
	const secondImageSize = radius * 0.35;
	const verticalOffset = imageSize * 1.75;

	ctx.drawImage(
		secondImage,
		-secondImageSize / 1.8,
		verticalOffset,
		secondImageSize * 1.2,
		secondImageSize * 1.2,
	);

	ctx.restore();
}

function drawRosace() {
	ctx.save();
	ctx.translate(centerX, centerY);

	const petalRadius = hexSize * 3.5;
	const lineWidth = 2;
	ctx.rotate(angle);

	ctx.strokeStyle = 'rgba(128, 128, 128, 1)';
	ctx.lineWidth = lineWidth;

	ctx.beginPath();

	for (let i = 0; i < petalCount; i++) {
		const angle = (i * 2 * Math.PI) / petalCount;

		const x1 = petalRadius * Math.cos(angle);
		const y1 = petalRadius * Math.sin(angle);

		for (let j = 1; j < petalCount; j++) {
			const subAngle = angle + (j * 2 * Math.PI) / petalCount;
			const x2 = petalRadius * Math.cos(subAngle);
			const y2 = petalRadius * Math.sin(subAngle);

			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
		}
	}

	ctx.stroke();
	ctx.restore();
}

let showPetal = true;

const loop = function () {
	window.requestAnimationFrame(loop);
	ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);

	drawVinyl();
	if (showPetal) {
		drawRosace();
	}
	drawImageOnVinyl();
	drawText();
	drawStars();
};

function updateValueDisplay() {
	loop();
}

document.getElementById('hexSize')?.addEventListener('input', (event) => {
	hexSize = (event.target as HTMLInputElement).valueAsNumber;
	updateValueDisplay();
});
document.getElementById('petalCount')?.addEventListener('input', (event) => {
	petalCount = (event.target as HTMLInputElement).valueAsNumber;
	updateValueDisplay();
});

document.getElementById('rotateVinylBtn')?.addEventListener('click', () => {
	vinylRotationAngle += 10;
	if (vinylRotationAngle >= 360) vinylRotationAngle -= 360;
	updateValueDisplay;
});

document.getElementById('showPetalBtn')?.addEventListener('click', () => {
	showPetal = !showPetal;
	updateValueDisplay();
});

document.getElementById('textSize')?.addEventListener('input', (event) => {
	textSize = (event.target as HTMLInputElement).valueAsNumber;
	updateText();
});

document.getElementById('textColor')?.addEventListener('input', (event) => {
	textColor = (event.target as HTMLInputElement).value;
	updateText();
});

document.getElementById('strokeColor')?.addEventListener('input', (event) => {
	strokeColor = (event.target as HTMLInputElement).value;
	updateText();
});

document.getElementById('toggle3DEffectBtn')?.addEventListener('click', () => {
	is3DEffectEnabled = !is3DEffectEnabled;
	const button = document.getElementById('toggle3DEffectBtn')!;
	button.textContent = is3DEffectEnabled ? 'Désactiver l’effet 3D' : 'Activer l’effet 3D';
	loop();
});

document.getElementById('text3DOffset')?.addEventListener('input', (event) => {
	text3DOffset = (event.target as HTMLInputElement).valueAsNumber;
	document.getElementById('text3DOffsetValue')!.textContent = text3DOffset.toString();
	loop();
});

document.getElementById('shadowBtn')?.addEventListener('click', () => {
	shadowRotationAngle += 10;
	if (shadowRotationAngle >= 360) shadowRotationAngle -= 360;
	updateValueDisplay;
});

document.getElementById('logoBtn')?.addEventListener('click', () => {
	logoRotationAngle += 10;
	if (logoRotationAngle >= 360) logoRotationAngle -= 360;
	updateValueDisplay;
});

let is3DEffectEnabled = true;
let text3DOffset = 5;

function drawText() {
	ctx.save();

	const text = 'Absolution XX';
	const x = centerX;
	const y = 40;

	ctx.font = `bold ${textSize}px Arial`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';

	if (is3DEffectEnabled) {
		for (let i = text3DOffset; i > 0; i--) {
			ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + i / 10})`;
			ctx.fillText(text, x + i, y + i);
		}
	}

	ctx.fillStyle = textColor;
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = 2;
	ctx.strokeText(text, x, y);
	ctx.fillText(text, x, y);

	ctx.restore();
}

function updateText() {
	loop();
}

let stars: { x: number; y: number; size: number }[] = [];

function generateStars() {
	stars = [];
	const starCount = 200;
	for (let i = 0; i < starCount; i++) {
		const angle = Math.random() * 2 * Math.PI;
		const distance = radius + Math.random() * 100;
		const x = centerX + distance * Math.cos(angle);
		const y = centerY + distance * Math.sin(angle);
		const size = Math.random() * 3 + 1;
		stars.push({ x, y, size });
	}
}
generateStars();

function drawStars() {
	ctx.save();
	ctx.fillStyle = 'white';
	stars.forEach((star) => {
		ctx.beginPath();
		ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
		ctx.fill();
	});
	ctx.restore();
}

loop();
