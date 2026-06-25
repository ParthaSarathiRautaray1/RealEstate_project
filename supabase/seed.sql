insert into public.owners (id, name, email, phone, avatar_url, bio) values
('00000000-0000-0000-0000-000000000101', 'Maya Sterling', 'maya@example.com', '+1 212 555 0199', null, 'Portfolio owner focused on architect-designed residences.')
on conflict (id) do nothing;

insert into public.properties (id, title, slug, description, price, property_type, location, latitude, longitude, owner_id, featured, status) values
('00000000-0000-0000-0000-000000000201', 'Glass House Above the Park', 'glass-house-above-the-park', 'A luminous residence with floor-to-ceiling glazing, layered terraces, chef-grade kitchen, private elevator access, and sweeping skyline views designed for refined city living.', 6200000, 'Penthouse', 'Upper West Side, New York', 40.787, -73.9754, '00000000-0000-0000-0000-000000000101', true, 'published'),
('00000000-0000-0000-0000-000000000202', 'Cedar Ridge Villa', 'cedar-ridge-villa', 'A quiet modern villa with warm materials, outdoor entertaining spaces, spa-level baths, and a landscaped pool court connected to generous living rooms.', 3850000, 'Villa', 'Beverly Hills, California', 34.0736, -118.4004, '00000000-0000-0000-0000-000000000101', true, 'published')
on conflict (id) do nothing;

insert into public.property_images (property_id, url, alt, sort_order) values
('00000000-0000-0000-0000-000000000201', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop', 'Glass House Above the Park', 0),
('00000000-0000-0000-0000-000000000201', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop', 'Living room', 1),
('00000000-0000-0000-0000-000000000202', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop', 'Cedar Ridge Villa', 0)
on conflict do nothing;

insert into public.reviews (property_id, user_name, rating, review, approved) values
('00000000-0000-0000-0000-000000000201', 'Elena R.', 5, 'The listing had every detail I needed before scheduling a visit.', true),
('00000000-0000-0000-0000-000000000202', 'Marcus T.', 5, 'Beautiful presentation and fast follow-up from the team.', true);
