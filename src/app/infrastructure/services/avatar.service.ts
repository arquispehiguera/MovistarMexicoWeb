import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  buildAvatarUrl(name: string = 'Usuario', size = 64): string {
    const initials = this.getInitials(name);
    const bg = '#0A1628';
    const fontSize = Math.floor(size * 0.42);

    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/>`,
      `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"`,
      ` font-family="system-ui,sans-serif" font-size="${fontSize}" font-weight="600" fill="#ffffff">${initials}</text>`,
      `</svg>`
    ].join('');

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  private getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }

}
