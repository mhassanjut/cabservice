-- Point car image_url to responsive SVG fleet illustrations (full vehicle, mobile-friendly)
UPDATE cars SET image_url = '/img/vehicles/mercedes-vito-van.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000001';

UPDATE cars SET image_url = '/img/vehicles/mercedes-v-class.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000002';

UPDATE cars SET image_url = '/img/vehicles/mercedes-van-8-passenger.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000003';

UPDATE cars SET image_url = '/img/vehicles/mercedes-e-class.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000004';

UPDATE cars SET image_url = '/img/vehicles/mercedes-s-class.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000005';

UPDATE cars SET image_url = '/img/vehicles/tesla-model-s.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000006';

UPDATE cars SET image_url = '/img/vehicles/hyundai-ioniq.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000007';

UPDATE cars SET image_url = '/img/vehicles/toyota-corolla-familiar.svg', updated_at = NOW()
WHERE id = 'c0000001-0000-0000-0000-000000000008';
