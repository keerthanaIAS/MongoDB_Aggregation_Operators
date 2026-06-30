# Nearby Restaurant Finder - MongoDB Geospatial POC

A complete production-style application demonstrating all MongoDB geospatial features.

## Features Implemented

### Geospatial Concepts
- ✅ **GeoJSON**: Point, Polygon, MultiPolygon, LineString
- ✅ **2dsphere Index**: For geospatial queries
- ✅ **$near**: Find nearby documents
- ✅ **$nearSphere**: Find nearby on a sphere
- ✅ **$geoNear**: Aggregation pipeline for geospatial
- ✅ **$geoWithin**: Find within boundaries
- ✅ **$geoIntersects**: Find intersecting geometries
- ✅ **$centerSphere**: Circle queries
- ✅ **$box**: Bounding box queries
- ✅ **Distance calculations**: In meters, kilometers, miles
- ✅ **Pagination**: With geospatial queries
- ✅ **Filters**: Combine with other query criteria

### Restaurant Features
- Store location (GeoJSON Point)
- Multiple cuisines
- Ratings and reviews
- Price ranges
- Features (WiFi, Parking, etc.)
- Address details
- Distance calculations

## Installation

```bash
npm install
```
### Terminal Logs:
keerthana@Keerthanas-MacBook-Air restaurant-finder % npm install

added 73 packages, removed 1 package, and audited 99 packages in 3s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
keerthana@Keerthanas-MacBook-Air restaurant-finder % npm run seed

> restaurant-finder@1.0.0 seed
> node scripts/seed.js

✅ Connected to MongoDB
🧹 Cleared existing restaurants
✅ Inserted 10 restaurants
✅ 2dsphere index created
✅ City boundary and route saved

📊 Restaurant Statistics:
  - Fast Food: 3 restaurants
  - Italian: 2 restaurants
  - BBQ: 2 restaurants
  - Hyderabadi: 1 restaurants
  - Biryani: 1 restaurants
  - North Indian: 1 restaurants

💡 Query Examples:
  npm run query

✅ Seed complete!
keerthana@Keerthanas-MacBook-Air restaurant-finder % npm run query

> restaurant-finder@1.0.0 query
> node scripts/queries.js

✅ Connected to MongoDB

======================================================================
📊 MONGODB GEOSPATIAL QUERY DEMONSTRATION
======================================================================

1️⃣ $near - Nearby Restaurants (Sorted by Distance)
--------------------------------------------------
✅ Found 10 restaurants within 3km
   1. Paradise Biryani (Hyderabadi) - ⭐4.8
   2. Mehfil (Biryani) - ⭐4.7
   3. McDonald's (Fast Food) - ⭐4.4
   4. KFC (Fast Food) - ⭐4.1
   5. Subway (Fast Food) - ⭐4.3
   6. Pizza Hut (Italian) - ⭐4.2
   7. Dominos (Italian) - ⭐4
   8. Barbeque Nation (BBQ) - ⭐4.6
   9. Sahara Grill (BBQ) - ⭐4.2
   10. Taj Mahal Hotel (North Indian) - ⭐4.9

2️⃣ $near + Filter - Italian Restaurants
--------------------------------------------------
✅ Found 2 Italian restaurants
   - Pizza Hut (⭐4.2)
   - Dominos (⭐4)

3️⃣ $near + Rating Filter (>4.5)
--------------------------------------------------
✅ Found 4 top-rated restaurants
   - Paradise Biryani (⭐4.8)
   - Mehfil (⭐4.7)
   - Barbeque Nation (⭐4.6)
   - Taj Mahal Hotel (⭐4.9)

4️⃣ $nearSphere - Spherical Distance
--------------------------------------------------
✅ Found 10 restaurants within 3km (sphere)

5️⃣ $geoNear - Aggregation with Distance Calculation
--------------------------------------------------
✅ Top 5 nearest restaurants with distances:
   - Paradise Biryani: 0m (0.00km)
   - Mehfil: 169m (0.17km)
   - McDonald's: 375m (0.37km)
   - KFC: 407m (0.41km)
   - Subway: 619m (0.62km)

6️⃣ $geoWithin + $centerSphere - Within 5km Radius
--------------------------------------------------
✅ Found 10 restaurants within 5km

7️⃣ $geoWithin + $box - Rectangle Search
--------------------------------------------------
✅ Found 8 restaurants in bounding box

8️⃣ $geoWithin + Polygon - City Boundary
--------------------------------------------------
✅ Found 10 restaurants inside Hyderabad city

9️⃣ $geoNear + $match + $sort - Advanced
--------------------------------------------------
✅ Found 5 matching restaurants:
   - McDonald's: Fast Food, ⭐4.4, 374.8976210701903m
   - KFC: Fast Food, ⭐4.1, 407.3414719229985m
   - Subway: Fast Food, ⭐4.3, 618.5593902160815m
   - Pizza Hut: Italian, ⭐4.2, 791.7073972442911m
   - Dominos: Italian, ⭐4, 839.5780066150968m

🔟 Pagination - Page 2 (6-10 results)
--------------------------------------------------
✅ Page 2 results (6 - 10):
   - Pizza Hut (Italian)
   - Dominos (Italian)
   - Barbeque Nation (BBQ)
   - Sahara Grill (BBQ)
   - Taj Mahal Hotel (North Indian)

======================================================================
undefined
======================================================================

📋 Operators Demonstrated:
   ✅ $near - Find nearby sorted by distance
   ✅ $nearSphere - Spherical distance search
   ✅ $geoNear - Aggregation with distance
   ✅ $geoWithin - Within area
   ✅ $centerSphere - Radius on sphere
   ✅ $box - Rectangle search
   ✅ $geometry - GeoJSON polygon
   ✅ $match - Filter after geo query
   ✅ $sort - Sort by distance/rating
   ✅ $project - Select fields
   ✅ $limit - Limit results
   ✅ $skip - Pagination
   ✅ $addFields - Calculate distance fields

👋 Disconnected
keerthana@Keerthanas-MacBook-Air restaurant-finder % npm start

> restaurant-finder@1.0.0 start
> node index.js

✅ MongoDB Connected
📊 Database: restaurantFinder
🚀 Server running on port 3000
📍 http://localhost:3000/health


#### Operators Covered

Feature                           Operator
----------                    --------------------
Nearest search                      $near
Distance calculation                $geoNear
Radius search                       $centerSphere
Polygon search                      $geoWithin
Route search                        $geoIntersects
GeoJSON storage                     Point / Polygon / LineString
Indexing                            2dsphere

##### Be ready to answer these
Why use 2dsphere instead of a normal index?
Difference between $near and $geoNear?
Why must $geoNear be the first stage?
Why are coordinates stored as [longitude, latitude]?
How do you search within 5 km?
What is GeoJSON?
Difference between Polygon and LineString?
How would you build a Swiggy/Zomato nearby API?

###### Interview Questions - Answered
Q: Why longitude first in coordinates?
A: GeoJSON specification defines coordinate order as [x, y] which maps to [longitude, latitude]. This is the standard across all GeoJSON implementations.

Q: Difference between nearand nearandgeoNear?
A: $near is used with find() and automatically sorts by distance. $geoNear is used in aggregation pipelines and adds a distanceField with calculated distances, allowing further stages like $match, $project, and $group.

Q: Why 2dsphere index?
A: MongoDB requires a geospatial index to efficiently execute spherical queries like $near, $nearSphere, and $geoWithin. Without it, queries fail or perform full collection scans.

Q: Why divide by 6378.1?
A: $centerSphere expects radius in radians. Formula: radiusInRadians = distanceInKm / 6378.1 where 6378.1 km is Earth's approximate radius.

Q: Why must $geoNear be first?
A: MongoDB uses the geospatial index before any other stages. $geoNear must be first to correctly calculate distances before filtering or transforming documents.

# Flow
Client
↓
Express Route
↓
Controller
↓
MongoDB
↓
2dsphere Index
↓
Nearby Restaurants
↓
Pagination
↓
JSON Response

# How Swiggy/Zomato Uses This
User Opens App
↓
GPS Coordinates
↓
Backend
↓
MongoDB
↓
2dsphere Index
↓
Nearby Restaurants
↓
Filter
↓
Rating
↓
Delivery Time
↓
Return Restaurants

## Why do we need a 2dsphere index?
Because MongoDB requires a geospatial index to efficiently execute spherical queries. 
such as $near, $nearSphere, and $geoNear. Without it, these queries cannot use geospatial indexing and may fail or perform poorly.

## Difference between $near and $geoNear?
- $near
Used with find()
Returns nearby documents
Automatically sorts by distance
- $geoNear
Used in an aggregation pipeline
Returns nearby documents
Calculates and returns the distance
Can be combined with other aggregation stages like $match, $project, $group, and $sort

### Complete Operator Summary
| Operator         | Purpose                            | Typical Use Case             |
| ---------------- | ---------------------------------- | ---------------------------- |
| `$near`          | Find nearest documents             | Nearby restaurants           |
| `$nearSphere`    | Spherical nearest search           | Earth-based distance         |
| `$geoNear`       | Aggregation + distance calculation | Show distance to each result |
| `$geoWithin`     | Documents inside an area           | Delivery zones               |
| `$center`        | Circular search on a flat plane    | Small local areas            |
| `$centerSphere`  | Circular search on a sphere        | Radius in km                 |
| `$box`           | Rectangular search                 | Map selection                |
| `$geometry`      | GeoJSON shapes                     | Polygon, LineString, etc.    |
| `$geoIntersects` | Geometries that intersect          | Routes, regions, boundaries  |

#### $geoIntersects:
Note:-
With Point data (like our restaurant locations),
a point must lie exactly on the line to intersect, which is uncommon. 
In production, $geoIntersects is more often used with Polygon, MultiPolygon, or other area geometries rather than simple points.

#### LineString:
Use Cases:-
Delivery route
Bus route
Railway track
Running path

#### MultiPolygon:
Use Cases:-
Multiple delivery areas
Multiple cities
Separate business regions

#### Polygon:
*Interview Tip: A Polygon must repeat the first coordinate as the last coordinate to close the shape.*

#### Inside a Polygon:
Production Use Cases:-
Restaurants inside a city
Houses inside a locality
Delivery zone coverage

#### $box:
Visualization:-
+------------------------+
|                        |
|     Restaurant         |
|                        |
|   Restaurant           |
|                        |
+------------------------+
Production Use Cases:-
Find all stores in a city block
Real estate inside a map selection
Map drag-selection
EX: $box: [
        [78.4800, 17.3800], // Bottom-left
        [78.4950, 17.3920]  // Top-right
      ]

#### Why divide by 6378.1:
- MongoDB expects the radius in radians, not kilometers.
- Formula:
    radiusInRadians = distanceInKm / 6378.1
where 6378.1 km is the approximate radius of the Earth.
- How do you search within 10 km? *answer*: 10 / 6378.1

#### Why is $center rarely used?
Because it treats the Earth as a flat surface, so it becomes inaccurate over larger distances.

#### Why must $geoNear be the first stage in the aggregation pipeline?
Because MongoDB needs to use the geospatial index to *calculate distances* before any other aggregation stage changes or filters the documents. 
For that reason, *$geoNear must be the first stage* (with a few documented exceptions such as certain Atlas Search combinations).

#### Why use $geoNear instead of $near?
| `$near`                         | `$geoNear`                                                     |
| ------------------------------- | -------------------------------------------------------------- |
| Used with `find()`              | Used in an aggregation pipeline                                |
| Returns nearby documents        | Returns nearby documents **plus calculated distance**          |
| Automatically sorts by distance | Automatically sorts by distance                                |
| Can't add aggregation stages    | Can combine with `$match`, `$project`, `$group`, `$sort`, etc. |

#### Difference?
*$near* -> Uses geospatial index and returns nearby documents. With a 2dsphere index, it measures spherical distances on the Earth's surface.
*$nearSphere* -> Explicitly specifies spherical distance calculations. With a 2dsphere index, the behavior is effectively the same as $near, so you'll usually see the same results. Historically, $nearSphere existed before 2dsphere indexes became the standard.

#### $near:
sort automatically? Yes.
Nearest document comes first.
*They are already sorted*: ->  Nearest->Farthest

#### Easy way to remember:
$near
    ↓
Find nearest documents
(Modern MongoDB → Spherical with 2dsphere)

$nearSphere
    ↓
Also finds nearest documents
(Historical operator, same behavior with 2dsphere)

#### $near vs $geoWithin:
+----------------------+------------------------------------------+----------------------------------------------+
| Feature              | $near                                    | $geoWithin                                   |
+----------------------+------------------------------------------+----------------------------------------------+
| Purpose              | Finds nearest documents                  | Finds documents inside a specified area      |
| Returns              | Nearby documents                         | All documents within the area                |
| Sorting              | Automatically sorts by distance          | No sorting                                   |
| Distance Calculation | Yes                                      | No                                           |
| Maximum Distance     | Supports $maxDistance                    | Uses area (circle, box, polygon)             |
| Minimum Distance     | Supports $minDistance                    | Not supported                                |
| Uses Geometry        | Point only (search origin)               | Circle, Box, Polygon, MultiPolygon, etc.     |
| Typical Operator     | $geometry                                | $geometry, $box, $center, $centerSphere      |
| Use Case             | Nearby restaurants, taxis, hospitals     | Delivery zones, city boundaries, map regions |
| Result Order         | Nearest → Farthest                       | Unordered                                    |
| Index Required       | 2dsphere                                 | 2dsphere                                     |
| Works With           | find()                                   | find()                                       |
+----------------------+------------------------------------------+----------------------------------------------+

#### Easy way to remember:
| If you want...                                  | Use              |
| ----------------------------------------------- | ---------------- |
| "Show me the **nearest** restaurants."          | **`$near`**      |
| "Show me **all restaurants inside this area**." | **`$geoWithin`** |

*Notice in geowithin*:
It doesn't calculate or return distance.
It doesn't sort by nearest.
It simply checks whether each restaurant is inside the 5 km circle.

#### Final Cheat Sheet:
       Need                                   Use
-----------------------                   --------------------------
Closest restaurants                         $near
Closest drivers                             $near
Show distance in meters                     $geoNear
Inside a city                               $geoWithin
Inside a polygon                            $geoWithin
Inside a 5 km radius                        $geoWithin + $centerSphere
Inside a map rectangle                      $geoWithin + $box