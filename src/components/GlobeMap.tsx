import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods,} from "react-globe.gl";
import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import {
    splitBlocks,
    getField,
} from "../lib/parseMarkdown";
import "../styles/GlobeMap.css";

interface City {
    name: string;
    lat: number;
    lon: number;
    milestone: string;
    date: string;
    desc: string;
    images: string[];
}

function resolveAssetPath(path: string): string {
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    return `${import.meta.env.BASE_URL}${path.replace(
        /^\/+/,
        ""
    )}`;
}

function parseJourneyMap(raw: string): City[] {
    return splitBlocks(raw)
        .map(block => {
        const imagesRaw = getField(
            block,
            "Images"
        );

        return {
            name: getField(block, "Name"),
            lat:
            Number.parseFloat(
                getField(block, "Lat")
            ) || 0,
            lon:
            Number.parseFloat(
                getField(block, "Lon")
            ) || 0,
            milestone: getField(
            block,
            "Milestone"
            ),
            date: getField(block, "Date"),
            desc: getField(
            block,
            "Description"
            ),
            images: imagesRaw
            ? imagesRaw
                .split(",")
                .map(image =>
                    resolveAssetPath(
                    image.trim()
                    )
                )
                .filter(Boolean)
            : [],
        };
        })
        .filter(city => city.name.length > 0);
}

export default function GlobeMap() {
    const [sectionRef, inView] =
        useInView();

    const globeRef =
        useRef<GlobeMethods | undefined>(
        undefined
        );

    const [selected, setSelected] =
        useState<City | null>(null);

    const [lightboxImg, setLightboxImg] =
        useState<string | null>(null);

    const markdownPath = `${import.meta.env.BASE_URL}content/journey-map.md`;

    const { raw, loading, error } =
        useMarkdown(markdownPath);

    const cities = useMemo(
        () => parseJourneyMap(raw),
        [raw]
    );

    useEffect(() => {

        const timer = window.setTimeout(() => {
            const globe = globeRef.current;
            if (!globe) return;
            const controls = globe.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.7;
        }, 100);

        return () => window.clearTimeout(timer);
    }, []);

    const getAltitude = (city: City) => {
        switch (city.name) {
            case "New Brunswick Hatchery":
            case "Jersey City":
            case "New York City":
            case "London":
                return 0.45; // much closer zoom
            default:
                return 0.9;
        }
    };

    const selectCity = (city: City) => {
    setSelected(city);

        const globe = globeRef.current;

        if (!globe) return;
        globe.controls().autoRotate = false;
        globe.pointOfView(
            {
            lat: city.lat + 2,
            lng: city.lon - 2,
            altitude: getAltitude(city),
            },
            1800
        );
    };

    return (
        <section
        id="journey"
        ref={sectionRef}
        className="journey"
        >
        <div className="journey__container">
            <p className="journey__eyebrow">
            09 / Research Journey
            </p>

            <h2 className="journey__heading">
            From campus to capital
            </h2>

            <p className="journey__intro">
            Select a location on the globe or from the list to explore each research milestone.
            </p>

            {loading && (
            <p className="journey__status">
                Loading journey…
            </p>
            )}

            {!loading && error && (
            <p className="journey__status journey__status--error">
                {error}
            </p>
            )}

            {!loading &&
            cities.length > 0 && (
                <div
                className="journey__layout"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                    ? "translateY(0)"
                    : "translateY(20px)",
                    transition:
                    "opacity 0.8s ease, transform 0.8s ease",
                }}
                >
                <div className="journey__globe">
                    <Globe
                    ref={globeRef}
                    width={520}
                    height={520}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl={`${import.meta.env.BASE_URL}images/earth_atmos_2048.jpg`}
                    bumpImageUrl={`${import.meta.env.BASE_URL}images/earth_normal_2048.jpg`}
                    pointsData={cities}
                    pointLat={city =>
                        (city as City).lat
                    }
                    pointLng={city =>
                        (city as City).lon
                    }
                    pointColor={() =>
                        "#1A73E8"
                    }
                    pointAltitude={0.025}
                    pointRadius={0.35}
                    pointLabel={city => {
                        const item =
                        city as City;

                        return `
                        <div style="
                            background:#050F1C;
                            color:#F8FAFC;
                            padding:10px 12px;
                            border:1px solid rgba(26,115,232,.35);
                            border-radius:6px;
                            font-family:Inter,sans-serif;
                        ">
                            <strong>${item.name}</strong>
                            <br />
                            <span style="color:#94A3B8;font-size:12px">
                            ${item.milestone}
                            </span>
                        </div>
                        `;
                    }}
                    onPointClick={point =>
                        selectCity(
                        point as City
                        )
                    }
                    ringsData={cities}
                    ringLat={city =>
                        (city as City).lat
                    }
                    ringLng={city =>
                        (city as City).lon
                    }
                    ringColor={() => [
                        "rgba(26,115,232,0.8)",
                        "rgba(26,115,232,0)",
                    ]}
                    ringMaxRadius={2.5}
                    ringPropagationSpeed={1.4}
                    ringRepeatPeriod={1200}
                    atmosphereColor="#64B5F6"
                    atmosphereAltitude={0.14}
                    />
                </div>

                <div className="journey__details">
                    {selected ? (
                    <article>
                        <button
                        type="button"
                        className="journey__back"
                        onClick={() => {
                            setSelected(null);

                            const globe = globeRef.current;

                            if (!globe) return;

                            globe.pointOfView(
                                {
                                lat: 20,
                                lng: -40,
                                altitude: 1.7,
                                },
                                1400
                            );

                            window.setTimeout(() => {
                                globe.controls().autoRotate = true;
                            }, 1400);
                        }}
                                                >
                        ← All locations
                        </button>

                        <div className="journey__date">
                        {selected.date}
                        </div>

                        <h3 className="journey__milestone">
                        {selected.milestone}
                        </h3>

                        <h4 className="journey__city">
                        {selected.name}
                        </h4>

                        <p className="journey__description">
                        {selected.desc}
                        </p>

                        {selected.images.length >
                        0 && (
                        <div className="journey__gallery">
                            {selected.images.map(
                            (
                                image,
                                index
                            ) => (
                                <button
                                key={image}
                                type="button"
                                className="journey__thumbnail"
                                onClick={() =>
                                    setLightboxImg(
                                    image
                                    )
                                }
                                >
                                <img
                                    src={image}
                                    alt={`${selected.name} ${index + 1}`}
                                />
                                </button>
                            )
                            )}
                        </div>
                        )}
                    </article>
                    ) : (
                    <div>
                        <h3 className="journey__list-heading">
                        Research locations
                        </h3>

                        <div className="journey__locations">
                        {cities.map(city => (
                            <button
                            key={city.name}
                            type="button"
                            className="journey__location"
                            onClick={() =>
                                selectCity(city)
                            }
                            >
                            <span className="journey__location-dot" />

                            <span className="journey__location-content">
                                <span className="journey__location-name">
                                {city.name}
                                </span>

                                <span className="journey__location-meta">
                                {city.milestone} ·{" "}
                                {city.date}
                                </span>

                                <span className="journey__location-desc">
                                {city.desc}
                                </span>
                            </span>

                            <span className="journey__location-arrow">
                                →
                            </span>
                            </button>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
                </div>
            )}
        </div>

        {lightboxImg && (
            <div
            className="journey-lightbox"
            onClick={() =>
                setLightboxImg(null)
            }
            >
            <button
                type="button"
                className="journey-lightbox__close"
                onClick={() =>
                setLightboxImg(null)
                }
            >
                ×
            </button>

            <img
                src={lightboxImg}
                alt=""
                onClick={event =>
                event.stopPropagation()
                }
            />
            </div>
        )}
        </section>
    );
}