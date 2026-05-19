#!/usr/bin/env python3
"""process_monitor.py -- Real-time process monitor"""
import subprocess, sys, time, argparse, os

def adb(cmd):
    r = subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True)
    return r.stdout.strip()

def get_processes():
    out = adb("ps -eo pid,user,vsz,rss,comm")
    procs = []
    for line in out.splitlines()[1:]:
        parts = line.split()
        if len(parts) >= 5:
            try:
                pid, user, vsz, rss = int(parts[0]), parts[1], int(parts[2]), int(parts[3])
                comm = ' '.join(parts[4:])
                procs.append({'pid': pid, 'user': user, 'vsz': vsz, 'rss': rss, 'comm': comm})
            except:
                pass
    return procs

def format_size(b):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if b < 1024:
            return f"{b:.1f}{unit}"
        b /= 1024
    return f"{b:.1f}TB"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--filter", help="Filter by process name")
    parser.add_argument("--top", type=int, default=15)
    args = parser.parse_args()

    try:
        while True:
            os.system("clear")
            procs = get_processes()
            if args.filter:
                procs = [p for p in procs if args.filter.lower() in p['comm'].lower()]
            procs.sort(key=lambda x: x['rss'], reverse=True)
            print(f"{'PID':<8} {'User':<10} {'VSZ':<10} {'RSS':<10} {'Process'}")
            print("─" * 70)
            for p in procs[:args.top]:
                print(f"{p['pid']:<8} {p['user']:<10} {format_size(p['vsz']):<10} {format_size(p['rss']):<10} {p['comm'][:40]}")
            time.sleep(2)
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
