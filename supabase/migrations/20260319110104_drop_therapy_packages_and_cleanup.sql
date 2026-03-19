revoke delete on table "public"."therapy_package_items" from "anon";

revoke insert on table "public"."therapy_package_items" from "anon";

revoke references on table "public"."therapy_package_items" from "anon";

revoke select on table "public"."therapy_package_items" from "anon";

revoke trigger on table "public"."therapy_package_items" from "anon";

revoke truncate on table "public"."therapy_package_items" from "anon";

revoke update on table "public"."therapy_package_items" from "anon";

revoke delete on table "public"."therapy_package_items" from "authenticated";

revoke insert on table "public"."therapy_package_items" from "authenticated";

revoke references on table "public"."therapy_package_items" from "authenticated";

revoke select on table "public"."therapy_package_items" from "authenticated";

revoke trigger on table "public"."therapy_package_items" from "authenticated";

revoke truncate on table "public"."therapy_package_items" from "authenticated";

revoke update on table "public"."therapy_package_items" from "authenticated";

revoke delete on table "public"."therapy_package_items" from "service_role";

revoke insert on table "public"."therapy_package_items" from "service_role";

revoke references on table "public"."therapy_package_items" from "service_role";

revoke select on table "public"."therapy_package_items" from "service_role";

revoke trigger on table "public"."therapy_package_items" from "service_role";

revoke truncate on table "public"."therapy_package_items" from "service_role";

revoke update on table "public"."therapy_package_items" from "service_role";

revoke delete on table "public"."therapy_packages" from "anon";

revoke insert on table "public"."therapy_packages" from "anon";

revoke references on table "public"."therapy_packages" from "anon";

revoke select on table "public"."therapy_packages" from "anon";

revoke trigger on table "public"."therapy_packages" from "anon";

revoke truncate on table "public"."therapy_packages" from "anon";

revoke update on table "public"."therapy_packages" from "anon";

revoke delete on table "public"."therapy_packages" from "authenticated";

revoke insert on table "public"."therapy_packages" from "authenticated";

revoke references on table "public"."therapy_packages" from "authenticated";

revoke select on table "public"."therapy_packages" from "authenticated";

revoke trigger on table "public"."therapy_packages" from "authenticated";

revoke truncate on table "public"."therapy_packages" from "authenticated";

revoke update on table "public"."therapy_packages" from "authenticated";

revoke delete on table "public"."therapy_packages" from "service_role";

revoke insert on table "public"."therapy_packages" from "service_role";

revoke references on table "public"."therapy_packages" from "service_role";

revoke select on table "public"."therapy_packages" from "service_role";

revoke trigger on table "public"."therapy_packages" from "service_role";

revoke truncate on table "public"."therapy_packages" from "service_role";

revoke update on table "public"."therapy_packages" from "service_role";

alter table "public"."prescriptions" drop constraint "prescriptions_therapy_package_id_fkey";

alter table "public"."therapy_package_items" drop constraint "therapy_package_items_package_id_fkey";

alter table "public"."therapy_package_items" drop constraint "therapy_package_items_project_id_fkey";

alter table "public"."therapy_package_items" drop constraint "therapy_package_items_pkey";

alter table "public"."therapy_packages" drop constraint "therapy_packages_pkey";

drop index if exists "public"."therapy_package_items_pkey";

drop index if exists "public"."therapy_packages_pkey";

drop table "public"."therapy_package_items";

drop table "public"."therapy_packages";

alter table "public"."prescriptions" drop column "therapy_package_id";
