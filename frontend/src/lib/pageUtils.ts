export function getPageName(page: { slug?: string; title?: string } | null | undefined): string {
  if (!page) return '';
  const slug = (page.slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');

  const exactMap: Record<string, string> = {
    'home': 'Home',
    'about-us': 'About Us',
    'about': 'About Us',
    'contact-us': 'Contact Us',
    'contact': 'Contact Us',
    'services': 'Services',
    'blog': 'Blog',
    'blogs': 'Blog',
    'faqs': 'FAQs',
    'faq': 'FAQs',
    'privacy-policy': 'Privacy Policy',
    'terms-and-conditions': 'Terms & Conditions',
    'terms-conditions': 'Terms & Conditions',
    'terms': 'Terms & Conditions',
    'locations': 'Locations',
    'services/full-home-interior-design': 'Full Home Interior Design',
    'services/modular-kitchen-design': 'Modular Kitchen Design',
    'services/living-room-interior-design': 'Living Room Interior Design',
    'services/bedroom-interior-design': 'Bedroom Interior Design',
    'services/wardrobe-design': 'Wardrobe Design',
    'services/home-renovation': 'Home Renovation & Remodeling',
    'services/office-interior-design': 'Office Interior Design',
    'services/corporate-office-interior-design': 'Corporate Office Interior Design',
    'services/commercial-interior-design': 'Commercial Interior Design',
    'services/turnkey-interior-design': 'Turnkey Interior Design',
    'locations/noida': 'Interior Designers in Noida',
    'locations/greater-noida': 'Interior Designers in Greater Noida',
    'locations/delhi': 'Interior Designers in Delhi',
    'locations/new-delhi': 'Interior Designers in New Delhi',
    'locations/gurgaon': 'Interior Designers in Gurgaon',
  };

  if (slug && exactMap[slug]) {
    return exactMap[slug];
  }

  // If slug is a sub-path under locations, prefix with "Interior Designers in "
  if (slug.startsWith('locations/')) {
    const loc = slug.replace(/^locations\//, '');
    const formattedLoc = loc
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `Interior Designers in ${formattedLoc}`;
  }

  // If slug has another sub-path like 'services/xyz'
  if (slug.includes('/')) {
    const parts = slug.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // If title has a pipe or hyphen, take the friendly first part
  if (page.title) {
    const parts = page.title.split(/[|–—]/);
    if (parts.length > 1) {
      const clean = parts[0].trim();
      if (/about\s+archovex/i.test(clean)) return 'About Us';
      if (/contact\s+archovex/i.test(clean)) return 'Contact Us';
      return clean;
    }
  }

  if (slug) {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return page.title || 'Untitled Page';
}

export function createWhatsAppConsultationUrl({
  whatsappNumber,
  name,
  phone,
  email,
  address,
  requirement,
  sourceTitle,
}: {
  whatsappNumber?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  requirement?: string;
  sourceTitle?: string;
}): string {
  const cleanPhone = (whatsappNumber || '+919217614436').replace(/[^0-9]/g, '');
  const lines: string[] = [
    '👋 *Hello ARCHOVEX INFRA!*',
    sourceTitle
      ? `I would like to book an interior design consultation for: *${sourceTitle}*`
      : 'I would like to book a free interior design consultation.',
    '',
    `👤 *Name:* ${name.trim()}`,
    `📞 *Mobile:* ${phone.trim()}`,
  ];
  if (email && email.trim()) {
    lines.push(`📧 *Email:* ${email.trim()}`);
  }
  if (address && address.trim()) {
    lines.push(`📍 *Address / City:* ${address.trim()}`);
  }
  if (requirement && requirement.trim()) {
    lines.push(`📝 *Requirement:* ${requirement.trim()}`);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

