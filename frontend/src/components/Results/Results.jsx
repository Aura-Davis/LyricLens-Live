import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import './Results.css';

export default function Results({ data }) {
    if (!data) return null;
    console.log("Results data:", data);

    const hasLyrics = !!data.lyrics;
    const hasAnalysis = data.analysis && data.analysis.emotion_breakdown && Object.keys(data.analysis.emotion_breakdown).length > 0;
    const hasSpotify = data.spotify_info && data.spotify_info.album_art;

    // Prepare chart data only if analysis exists
    const chartData = hasAnalysis
        ? Object.entries(data.analysis.emotion_breakdown)
            .filter(([_, value]) => Number(value) > 0)
            .map(([key, value]) => ({
                name: key.toLowerCase(),
                value: Number(value)
            }))
        : [];
    console.log("Has analysis:", hasAnalysis);
    console.log("Chart data:", chartData);

    const EMOTION_COLORS = {
        happy: "#FFCE56",
        angry: "#E91E63",
        surprise: "#FF8C00",
        sad: "#36A2EB",
        fear: "#AA00FF",
    };

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Slightly further out
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${chartData[index].name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    return (
        <div className="results-container">
            {hasLyrics && (
                <>
                    <h2>Lyrics:</h2>
                    <pre className="lyrics-block">{data.lyrics}</pre>
                </>
            )}

            

            {chartData.length > 0 ? (
                <div className="chart-album-wrapper">

                    <h2>
                        Dominant Emotion:
                        <span className="dominant-emotion">{data.analysis.emotion}</span>
                    </h2>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={renderCustomizedLabel}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={EMOTION_COLORS[entry.name.toLowerCase()] || "#CCCCCC"}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    
                </div>
            ) : (
                <></>
            )}

            {data.genius_url && hasSpotify && (
                <div>
                    <a
                        href={data.genius_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="genius-link"
                    >
                    View on Genius
                    </a>
                    <br></br>
                    <div className="album-container">
                        <a
                            href={data.spotify_info.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={data.spotify_info.album_art}
                                alt="Album Art"
                                className="album-art"
                            />
                        </a>
                        <a
                            href={data.spotify_info.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-link"
                        >
                            Listen on Spotify
                        </a>
                    </div>
                </div>

            )}

            {!hasLyrics && !hasAnalysis && !data.genius_url && (
                <p>No results available.</p>
            )}
        </div>
    );
}
