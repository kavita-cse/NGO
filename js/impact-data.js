/**
 * Data Access Layer for Impact Stories (Highlights, Spotlight, Posts)
 * Connected to Supabase with fallback to mock data
 */

const fallbackHighlights = [
  { id: 'h1', title: 'Tree Plantation', coverImage: 'images/hero_uploaded_image.png', date: '12 May 2026', location: 'Central Park', shortDescription: 'Planted 100 saplings.', fullDescription: 'A successful tree plantation drive where volunteers from all over the city joined to plant 100 saplings.', impactText: '100 Saplings Planted', category: 'Environment', status: 'Published', order: 1 },
  { id: 'h2', title: 'Health Camp', coverImage: 'images/people_circle_1777609298590.png', date: '14 May 2026', location: 'Community Center', shortDescription: 'Free checkups for all.', fullDescription: 'Provided free health checkups and basic medicines to over 200 individuals.', impactText: '200+ People Treated', category: 'Health', status: 'Published', order: 2 },
  { id: 'h3', title: 'Education Drive', coverImage: 'images/hero_banner_1777609201857.png', date: '16 May 2026', location: 'City School', shortDescription: 'Distributed books.', fullDescription: 'Distributed textbooks and stationary to underprivileged children.', impactText: '500+ Books Donated', category: 'Education', status: 'Published', order: 3 }
];

const fallbackPosts = [
  { id: 'p1', title: 'Clean Water Initiative', category: 'Health', image: 'images/hero_uploaded_image.png', date: '10 May 2026', location: 'North District', shortDescription: 'Providing clean water filters to 100 families.', fullDescription: 'Access to clean water is a fundamental human right. Our team distributed 100 advanced water filtration units to families lacking access to safe drinking water, drastically reducing the risk of waterborne diseases.', impactText: '100 Filters Distributed', status: 'Published' },
  { id: 'p2', title: 'Community Green Day', category: 'Environment', image: 'images/hero_banner_1777609201857.png', date: '12 May 2026', location: 'Park Avenue', shortDescription: 'Planted 500 trees in the local park.', fullDescription: 'In our effort to increase the green cover, we organized a massive tree plantation drive. Over 50 volunteers participated to plant native tree species that require less water and provide more shade.', impactText: '500 Trees Planted', status: 'Published' },
  { id: 'p3', title: 'Women Empowerment Workshop', category: 'Social Awareness', image: 'images/people_circle_1777609298590.png', date: '15 May 2026', location: 'Town Hall', shortDescription: 'Skill building for women entrepreneurs.', fullDescription: 'A 3-day workshop focusing on financial literacy, small business management, and digital marketing skills to empower local women to start and scale their own businesses.', impactText: '50 Women Certified', status: 'Published' },
  { id: 'p4', title: 'Forest Visit', category: 'Environment', image: 'images/hero_banner_1777609201857.png', date: '1 June 2026', location: 'Forest Reserve', shortDescription: 'A guided nature walk to raise awareness about forest conservation and biodiversity.', fullDescription: 'Our team organized a guided forest visit to help volunteers and community members connect with nature firsthand. Participants learned about local flora and fauna, the importance of forest ecosystems, and how everyday actions impact biodiversity. The visit concluded with a small sapling planting activity.', impactText: '30+ Participants', status: 'Published' }
];

const fallbackHeroSlides = [
  {
    id: 'slide-fallback-1',
    title: 'Community Farming & Gardening',
    description: 'Empowering communities through shared agricultural learning, local participation, and sustainable organic cultivation.',
    image: 'images/hero_banner_1777609201857.png',
    order: 1,
    isFeatured: true
  },
  {
    id: 'slide-fallback-2',
    title: 'Nurturing Awareness & Civic Responsibility',
    description: 'Fostering collective action, environmental ownership, and hygiene awareness among children and communities.',
    image: 'images/people_circle_1777609298590.png',
    order: 2,
    isFeatured: true
  }
];

const fallbackSpotlight = { 
  id: 's1', 
  title: 'Mega Food Drive', 
  category: 'Community Support', 
  image: 'images/hero_banner_1777609201857.png', 
  shortDescription: 'Join our massive initiative to ensure no one in our city goes to bed hungry. We are scaling up our food distribution network.', 
  fullDescription: 'Our Mega Food Drive aims to collect and distribute nutritious meals to vulnerable communities across the city. By partnering with local restaurants, supermarkets, and a network of dedicated volunteers, we are recovering surplus food and delivering it to those who need it most.',
  impactStat1: '5000+ Meals', 
  impactStat2: '10 Areas', 
  impactStat3: '200 Volunteers', 
  buttonText: 'Get Involved Today', 
  buttonLink: '#', 
  isSpotlight: true, 
  status: 'Active' 
};

window.ImpactData = {
  // HIGHLIGHTS
  getHighlights: async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_highlights')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetch failed for highlights, using fallback data.', err);
      return fallbackHighlights;
    }
  },
  
  saveHighlights: async (highlights) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_highlights')
        .upsert(highlights);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving highlights:', err);
    }
  },

  deleteHighlight: async (id) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_highlights')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting highlight:', err);
    }
  },
  
  // POSTS
  getPosts: async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_posts')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetch failed for posts, using fallback data.', err);
      return fallbackPosts;
    }
  },

  
  savePosts: async (posts) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_posts')
        .upsert(posts);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving posts:', err);
    }
  },

  deletePost: async (id) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  },

  // SPOTLIGHT
  getSpotlight: async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_spotlight')
        .select('*')
        .eq('isSpotlight', true)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (err) {
      console.warn('Supabase fetch failed for spotlight, using fallback data.', err);
      return fallbackSpotlight;
    }
  },

  getSpotlights: async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_spotlight')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetch failed for spotlights, using fallback data.', err);
      return [fallbackSpotlight];
    }
  },
  
  saveSpotlight: async (spotlight) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_spotlight')
        .upsert([spotlight]);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving spotlight:', err);
    }
  },

  deleteSpotlight: async (id) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_spotlight')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting spotlight:', err);
    }
  },

  getHeroSlides: async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_hero_slides')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return (data && data.length > 0) ? data : fallbackHeroSlides;
    } catch (err) {
      console.warn('Supabase fetch failed for hero slides, using fallback data.', err);
      return fallbackHeroSlides;
    }
  },

  saveHeroSlides: async (slides) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_hero_slides')
        .upsert(slides, { onConflict: 'id' });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving hero slides:', err);
      return { success: false, error: err };
    }
  },

  deleteHeroSlide: async (id) => {
    try {
      const { error } = await window.supabaseClient
        .from('ngo_hero_slides')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error deleting hero slide:', err);
      return { success: false, error: err };
    }
  },

  // UTILS
  generateId: () => {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
};
