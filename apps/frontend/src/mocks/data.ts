export interface MockImage {
  id: string
  title: string
  description: string
  src: string
  center: string
  dateCreated: string
  keywords: string[]
  mediaType: "image"
  aiSummary?: string
  aiTags?: string[]
}

export interface MockCollection {
  id: string
  name: string
  description: string
  coverSrc: string
  imageIds: string[]
  createdAt: string
}

export const mockImages: MockImage[] = [
  {
    id: "img-mars-surface",
    title: "Martian Terrain at Jezero Crater",
    description:
      "A panoramic view of the rocky Martian surface captured by the Perseverance rover, showing layered sedimentary rock formations and a dusty pink sky.",
    src: "/nasa/mars-surface.png",
    center: "JPL",
    dateCreated: "2021-03-04",
    keywords: ["Mars", "Perseverance", "Jezero", "surface", "geology"],
    mediaType: "image",
    aiSummary:
      "Sedimentary layering suggests an ancient lakebed environment, a prime target for astrobiology sampling.",
    aiTags: ["red planet", "rover", "geology", "exploration"],
  },
  {
    id: "img-nebula",
    title: "Emission Nebula in Carina",
    description:
      "Towering clouds of teal and amber interstellar gas and dust illuminated by young, massive stars within the Carina constellation.",
    src: "/nasa/nebula.png",
    center: "STScI",
    dateCreated: "2022-07-12",
    keywords: ["nebula", "Carina", "Hubble", "star formation", "deep space"],
    mediaType: "image",
    aiSummary:
      "Active stellar nursery where radiation pressure sculpts pillars of gas into ridges and cavities.",
    aiTags: ["nebula", "star formation", "deep space", "Hubble"],
  },
  {
    id: "img-galaxy",
    title: "Face-On Spiral Galaxy NGC 1232",
    description:
      "A grand-design spiral galaxy seen face-on, with a bright core and sweeping blue arms dotted with pink star-forming regions.",
    src: "/nasa/galaxy.png",
    center: "GSFC",
    dateCreated: "2020-11-30",
    keywords: ["galaxy", "spiral", "NGC", "stars", "cosmos"],
    mediaType: "image",
    aiSummary:
      "Spiral arm structure traces density waves driving ongoing star formation across the disk.",
    aiTags: ["galaxy", "spiral", "cosmos"],
  },
  {
    id: "img-earth",
    title: "Earth from the ISS",
    description:
      "The curvature of Earth glowing against the black of space, with swirling cloud systems over deep blue oceans.",
    src: "/nasa/earth.png",
    center: "JSC",
    dateCreated: "2023-01-18",
    keywords: ["Earth", "ISS", "orbit", "atmosphere", "blue marble"],
    mediaType: "image",
    aiSummary:
      "Cloud formations indicate active weather systems across the equatorial Pacific.",
    aiTags: ["Earth", "orbit", "atmosphere"],
  },
  {
    id: "img-moon",
    title: "Lunar Surface, Apollo Era",
    description:
      "Gray cratered lunar terrain with sharp shadows under a black sky, a hallmark of the Apollo surface photography.",
    src: "/nasa/moon.png",
    center: "JSC",
    dateCreated: "1972-12-11",
    keywords: ["Moon", "Apollo", "lunar", "craters", "surface"],
    mediaType: "image",
    aiSummary:
      "Regolith texture and crater density consistent with the lunar highlands.",
    aiTags: ["Moon", "Apollo", "lunar"],
  },
  {
    id: "img-iss",
    title: "International Space Station in Orbit",
    description:
      "The ISS with extended solar arrays orbiting above the blue limb of Earth.",
    src: "/nasa/iss.png",
    center: "JSC",
    dateCreated: "2021-11-08",
    keywords: ["ISS", "station", "orbit", "spacecraft", "solar arrays"],
    mediaType: "image",
    aiSummary:
      "Solar array orientation optimized for power generation during the orbital day pass.",
    aiTags: ["ISS", "spacecraft", "orbit"],
  },
  {
    id: "img-rover",
    title: "Perseverance Rover Self-Portrait",
    description:
      "A self-portrait of the Perseverance rover on the red dusty Martian surface with its robotic arm extended.",
    src: "/nasa/rover.png",
    center: "JPL",
    dateCreated: "2021-09-10",
    keywords: ["Mars", "rover", "Perseverance", "selfie", "robotics"],
    mediaType: "image",
    aiSummary:
      "Dust accumulation on the deck remains within nominal operating thresholds.",
    aiTags: ["rover", "Mars", "robotics"],
  },
  {
    id: "img-saturn",
    title: "Saturn and Its Rings",
    description:
      "The golden planet Saturn with its iconic ring system casting shadows across the banded atmosphere.",
    src: "/nasa/saturn.png",
    center: "JPL",
    dateCreated: "2017-04-26",
    keywords: ["Saturn", "rings", "Cassini", "planet", "gas giant"],
    mediaType: "image",
    aiSummary:
      "Ring shadow geometry indicates the planet's seasonal axial tilt toward the Sun.",
    aiTags: ["Saturn", "rings", "gas giant"],
  },
  {
    id: "img-star-cluster",
    title: "Deep Field Star Cluster",
    description:
      "A James Webb-style deep field revealing thousands of stars and distant galaxies in warm gold and blue hues.",
    src: "/nasa/star-cluster.png",
    center: "STScI",
    dateCreated: "2022-12-01",
    keywords: ["deep field", "JWST", "stars", "galaxies", "infrared"],
    mediaType: "image",
    aiSummary:
      "Infrared depth reveals galaxies from the early universe behind the foreground cluster.",
    aiTags: ["deep field", "JWST", "galaxies"],
  },
  {
    id: "img-astronaut",
    title: "Spacewalk Above Earth",
    description:
      "An astronaut in a white spacesuit on a spacewalk, tethered outside the spacecraft with Earth glowing below.",
    src: "/nasa/astronaut.png",
    center: "JSC",
    dateCreated: "2019-10-18",
    keywords: ["astronaut", "EVA", "spacewalk", "spacesuit", "orbit"],
    mediaType: "image",
    aiSummary:
      "EVA conducted on the sunlit side of the orbit for optimal visibility.",
    aiTags: ["astronaut", "spacewalk", "EVA"],
  },
]

export const mockCollections: MockCollection[] = [
  {
    id: "col-mars",
    name: "Mars Missions",
    description: "Surface imagery and rover photography from the red planet.",
    coverSrc: "/nasa/mars-surface.png",
    imageIds: ["img-mars-surface", "img-rover"],
    createdAt: "2024-02-10",
  },
  {
    id: "col-deep-space",
    name: "Deep Space Wonders",
    description: "Nebulae, galaxies, and deep field captures from across the cosmos.",
    coverSrc: "/nasa/nebula.png",
    imageIds: ["img-nebula", "img-galaxy", "img-star-cluster", "img-saturn"],
    createdAt: "2024-03-22",
  },
  {
    id: "col-home",
    name: "Home & Orbit",
    description: "Our planet, the Moon, and human presence in low Earth orbit.",
    coverSrc: "/nasa/earth.png",
    imageIds: ["img-earth", "img-moon", "img-iss", "img-astronaut"],
    createdAt: "2024-04-05",
  },
]

export function getImage(id: string): MockImage | undefined {
  return mockImages.find((i) => i.id === id)
}

export function getCollection(id: string): MockCollection | undefined {
  return mockCollections.find((c) => c.id === id)
}
