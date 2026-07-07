-- Point car image_url to Wikimedia-sourced JPG assets in frontend /public/img/vehicles/
UPDATE cars SET image_url = '/img/vehicles/mercedes-vito-van.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000001';

UPDATE cars SET image_url = '/img/vehicles/mercedes-v-class.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000002';

UPDATE cars SET image_url = '/img/vehicles/mercedes-van-8-passenger.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000003';

UPDATE cars SET image_url = '/img/vehicles/mercedes-e-class.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000004';

UPDATE cars SET image_url = '/img/vehicles/mercedes-s-class.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000005';

UPDATE cars SET image_url = '/img/vehicles/tesla-model-s.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000006';

UPDATE cars SET image_url = '/img/vehicles/hyundai-ioniq.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000007';

UPDATE cars SET image_url = '/img/vehicles/toyota-corolla-familiar.jpg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000008';
