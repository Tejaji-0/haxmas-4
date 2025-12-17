import requests
import time

USELESS_FACTS_API = "https://uselessfacts.jsph.pl/random.json"
DEPLOYED_API = "https://fastdeploy.deployor.dev/u/ident!bWfa7N/haxmas-4/api/facts"

def get_existing_facts():
    """Fetch all existing facts from the deployed database"""
    try:
        response = requests.get(DEPLOYED_API)
        response.raise_for_status()
        facts = response.json()
        return {fact['fact'].lower().strip() for fact in facts}
    except Exception as e:
        print(f"Error fetching existing facts: {e}")
        return set()

def get_random_fact():
    """Fetch a random fact from uselessfacts API"""
    try:
        response = requests.get(USELESS_FACTS_API)
        response.raise_for_status()
        data = response.json()
        return data.get('text', '').strip()
    except Exception as e:
        print(f"Error fetching random fact: {e}")
        return None

def add_fact_to_db(fact):
    """Add a fact to the deployed database"""
    try:
        response = requests.post(
            DEPLOYED_API,
            json={"fact": fact},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error adding fact: {e}")
        return None

def main():
    print("Starting fact collection...")
    print(f"Target: {DEPLOYED_API}\n")

    existing_facts = get_existing_facts()
    print(f"Found {len(existing_facts)} existing facts in database\n")
    
    added_count = 0
    skipped_count = 0
    max_attempts = 50
    
    for i in range(max_attempts):
        print(f"[{i+1}/{max_attempts}] Fetching random fact...", end=" ")
        
        fact = get_random_fact()
        
        if not fact:
            print("❌ Failed to fetch")
            continue
        

        if fact.lower().strip() in existing_facts:
            print(f"⏭️  Duplicate: {fact[:60]}...")
            skipped_count += 1
            time.sleep(0.5)
            continue
        
        # Add new fact
        result = add_fact_to_db(fact)
        
        if result:
            print(f"✅ Added (ID: {result.get('id')}): {fact[:60]}...")
            existing_facts.add(fact.lower().strip())
            added_count += 1
        else:
            print(f"❌ Failed to add")

        time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"📈 Summary:")
    print(f"   ✅ Added: {added_count} new facts")
    print(f"   ⏭️  Skipped: {skipped_count} duplicates")
    print(f"   📊 Total in DB: {len(existing_facts)} facts")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
