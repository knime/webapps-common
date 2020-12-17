# SVG-Style-Guidelines
To maintain a consistent structure of the files, SVGs uploaded to this repository should meet the following requirements:

- Icons are made out of lines and not faces
- Stroke width is set via css to maintain crisp text when zooming in and out
- Multiple d values are concatenated into one
- Before new SVGs are included, they should be cleaned up. This means, that:
    - Unnecessary Tags are removed
    - XML Headers are removed
    - View Box is set to 0 0 32 32
    - There is a stroke color set
- Text elements have the following attributes set: `class="text" fill="black" stroke="none" stroke-linejoin="miter"`
- Stroke-miterlimit is not needed in most cases, check if it is needed for your SVG
- Special case for dots in the SVG. These are made of a line width length 0 and the following attributes:
`stroke-linecap="round" x1="0" y1="0" x2="0" y2="0"   transform="translate(x, y) scale(1.6)"`