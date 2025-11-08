

import type { AbacaDetails } from '../types';

export const getFiberDetails = async (fiberType: string, grade: string): Promise<AbacaDetails> => {
  // Removed artificial delay to improve responsiveness
  // await new Promise(resolve => setTimeout(resolve, 500)); 

  if (grade === 'Unknown') {
      return {
          description: "The grade of the fiber could not be determined. Please try again with a clearer picture.",
          price: "N/A",
          uses: ["N/A"]
      };
  }

  // Mock data based on fiberType and grade
  const mockAbacaDetails: { [key: string]: AbacaDetails } = {
    'S2': {
      description: "S2 Abaca is a premium grade known for its exceptional strength and fineness, making it ideal for high-end textiles and specialty papers.",
      price: "$2.80 - $3.10",
      uses: ["High-quality textiles", "Specialty papers", "Marine ropes", "Handicrafts", "Automotive components"]
    },
    'S3': {
      description: "S3 Abaca is a strong and durable grade, slightly less refined than S2 but still excellent for demanding applications requiring high strength.",
      price: "$2.50 - $2.80",
      uses: ["Specialty paper", "Marine cordage", "Strong ropes", "Textile blends"]
    },
    'H': {
      description: "H grade Abaca is a standard commercial grade, balancing strength and processing ease, widely used in various industries.",
      price: "$1.70 - $2.00",
      uses: ["Industrial twines", "General cordage", "Paper pulp"]
    },
    'G': {
      description: "G grade Abaca is a good quality fiber, versatile for various industrial and handicraft applications, offering a balance of strength and flexibility.",
      price: "$2.10 - $2.45",
      uses: ["Pulp and paper", "Twine and cordage", "Tea bags", "Handicrafts", "Geo-textiles"]
    },
    'JK': {
      description: "JK grade Abaca is a coarser fiber, typically used for durable products where robust material is needed. It's known for its resistance to saltwater.",
      price: "$1.65 - $1.95",
      uses: ["Coarse ropes", "Matting", "Sacks", "Fishing nets"]
    },
    'M1': {
      description: "M1 Abaca is a medium-grade fiber often used in applications where high tensile strength is less critical but good overall performance is required.",
      price: "$1.90 - $2.20",
      uses: ["Ropes and cables", "Paper reinforcement", "Fiberboard", "Craft projects"]
    },
    'Y1': {
        description: "Y1 Abaca is a fine and lustrous grade, prized for its aesthetic qualities and used in premium decorative items.",
        price: "$2.20 - $2.50",
        uses: ["Decorative textiles", "Fine papers", "Artisan crafts"]
    },
    'Y2': {
        description: "Y2 Abaca offers good strength with a softer texture, suitable for applications needing flexibility and moderate durability.",
        price: "$1.80 - $2.10",
        uses: ["Lightweight ropes", "Handmade paper", "Bags"]
    },
    'I': {
        description: "I grade Abaca is a coarser fiber, valued for its rough texture and high durability in heavy-duty applications.",
        price: "$1.60 - $1.90",
        uses: ["Heavy-duty ropes", "Floor mats", "Reinforcement material"]
    },
    'EF': {
        description: "EF Abaca is an economy grade, commonly used for basic industrial applications and when cost-effectiveness is key.",
        price: "$1.50 - $1.75",
        uses: ["Industrial netting", "Thick ropes", "Reinforcement for composite materials"]
    },
  };

  const mockPinaDetails: { [key: string]: AbacaDetails } = {
    'Lino': {
      description: "Lino Piña is a very fine, translucent fiber known for its delicate texture and high quality, making it ideal for luxurious fabrics.",
      price: "$20 - $25 /m",
      uses: ["Luxury garments", "Wedding gowns", "Fine embroidery", "High-end artisanal products"]
    },
    'Bastos': {
      description: "Bastos Piña is a coarser, more robust fiber, still elegant but suitable for less delicate applications where durability is also a factor.",
      price: "$15 - $20 /m",
      uses: ["Casual wear", "Table linens", "Decorative items", "Handicrafts"]
    },
    'Seda': {
      description: "Seda Piña is a blend of Piña and silk fibers, offering the best of both worlds: the crispness of Piña with the softness and sheen of silk.",
      price: "$25 - $30 /m",
      uses: ["Premium garments", "Scarves", "Fashion accessories", "Upholstery"]
    },
    'Jusi': {
      description: "Jusi is a blend of Piña and Abaca or silk, creating a more affordable yet still elegant fabric, popular for traditional Filipino attire.",
      price: "$18 - $22 /m",
      uses: ["Barong Tagalog", "Filipiniana dresses", "Everyday garments", "Crafts"]
    }
  };

  if (fiberType === 'abaca') {
    return mockAbacaDetails[grade] || {
      description: `No specific details found for Abaca grade ${grade}.`,
      price: "N/A",
      uses: ["General abaca uses"]
    };
  } else if (fiberType === 'pina') {
    return mockPinaDetails[grade] || {
      description: `No specific details found for Piña grade ${grade}.`,
      price: "N/A",
      uses: ["General piña uses"]
    };
  }

  return {
    description: `No details found for fiber type ${fiberType} and grade ${grade}.`,
    price: "N/A",
    uses: ["N/A"]
  };
};