/**
 * Naming: user-facing title vs config/docker slug.
 * Use PRODUCT_NAME in UI/docs; use PRODUCT_SLUG and LEGACY_CONSOLE_DOCKER_IMAGE in .env & compose.
 */
export const PRODUCT_NAME = 'Universal iDRAC Console';
export const PRODUCT_SLUG = 'uidrac';
export const PRODUCT_API_NAME = 'Universal iDRAC Console API';
/** Docker image for iDRAC 6/7 legacy console containers. */
export const LEGACY_CONSOLE_DOCKER_IMAGE = 'uidrac:legacy';

/** MIT self-hosted edition — API reaches iDRAC on the local network (no edge agent). */
export const CLOUD_SAAS_PRODUCT = false;
export const OPEN_SOURCE_EDITION = true;

/** Seeded platform super-user (system tenant) — cannot be deleted. */
export const PRIMARY_PLATFORM_ADMIN_EMAIL = 'admin';

/** MIT open-source fork (no edge agent). */
export const GITHUB_REPO_OSS = 'https://github.com/sumit-kumawat/uidrac';

/** Conzex Global Private Limited — commercial product vendor (not distributed via public GitHub). */
export const CONZEX_WEB_URL = 'https://www.conzex.com';
export const CONZEX_CONTACT_EMAIL = 'info@conzex.com';

/** Open-source fork maintainer (MIT tree). */
export const OSS_AUTHOR_NAME = 'Sumit Kumawat';
export const OSS_AUTHOR_PROFILE_URL = 'https://www.sumitkumawat.com';
export const OSS_AUTHOR_EMAIL = 'hello@sumitkumawat.com';
